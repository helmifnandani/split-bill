import { useState } from "react";

const initialFriends = [
	{
		id: 118836,
		name: "Clark",
		image: "https://i.pravatar.cc/48?u=118836",
		balance: -7,
	},
	{
		id: 933372,
		name: "Sarah",
		image: "https://i.pravatar.cc/48?u=933372",
		balance: 20,
	},
	{
		id: 499476,
		name: "Anthony",
		image: "https://i.pravatar.cc/48?u=499476",
		balance: 0,
	},
];

export default function App() {
	const [isAddingFriend, setIsAddingFriend] = useState(false);
	const [listFriends, setListFriends] = useState(initialFriends);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function handleAddFriend(friend) {
		setListFriends((friends) => [...friends, friend]);
		setIsAddingFriend(false);
		setSelectedFriend(null);
	}

	function handleSelectFriend(friend) {
		setSelectedFriend((selected) =>
			selected?.id === friend.id ? null : friend
		);
		setIsAddingFriend(false);
	}

	function handleSplitBill(value) {
		setListFriends((listFriends) =>
			listFriends.map((friend) =>
				friend.id === selectedFriend.id
					? { ...friend, balance: friend.balance + value }
					: friend
			)
		);
		setSelectedFriend(null);
	}

	return (
		<div className="app">
			<div className="sidebar">
				<FriendsList
					listFriends={listFriends}
					onSelectFriend={handleSelectFriend}
					selectedFriend={selectedFriend}
				/>
				{isAddingFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
				<Button
					onButtonClick={() =>
						setIsAddingFriend((isAddingFriend) => !isAddingFriend)
					}>
					{isAddingFriend ? "Close" : "Add Friend"}
				</Button>
			</div>
			{selectedFriend ? (
				<FormSplitBill
					selectedFriend={selectedFriend}
					onSplitBill={handleSplitBill}
					key={selectedFriend.id}
				/>
			) : (
				""
			)}
		</div>
	);
}

function Button({ children, onButtonClick }) {
	return (
		<button className="button" onClick={onButtonClick}>
			{children}
		</button>
	);
}

function FriendsList({ listFriends, onSelectFriend, selectedFriend }) {
	return (
		<ul>
			{listFriends.map((friend) => {
				return (
					<Friend
						friend={friend}
						key={friend.id}
						onSelectFriend={onSelectFriend}
						selectedFriend={selectedFriend}
					/>
				);
			})}
		</ul>
	);
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
	const isSelected = selectedFriend?.id === friend.id;
	return (
		<li className={isSelected ? `selected` : ""}>
			<img src={friend.image} alt={friend.name} />
			<h3>{friend.name}</h3>

			{friend.balance < 0 && (
				<p className="red">
					You owe {friend.name} Rp {Math.abs(friend.balance)}
				</p>
			)}
			{friend.balance > 0 && (
				<p className="green">
					Your friend {friend.name} owe you Rp {Math.abs(friend.balance)}
				</p>
			)}
			{friend.balance === 0 && <p>You and {friend.name} are even</p>}

			<Button onButtonClick={() => onSelectFriend(friend)}>
				{isSelected ? `Close` : `Select`}
			</Button>
		</li>
	);
}

function FormAddFriend({ onAddFriend }) {
	const [name, setName] = useState("");
	const [image, setImage] = useState("https://i.pravatar.cc/48");

	function handleSubmitForm(event) {
		event.preventDefault();

		if (!name || !image) return;
		const guid = crypto.randomUUID();
		const newFriend = {
			name,
			image: `${image}?=${guid}`,
			balance: 0,
			id: guid,
		};
		onAddFriend(newFriend);
		setName("");
		setImage("https://i.pravatar.cc/48");
	}

	return (
		<form className="form-add-friend" onSubmit={handleSubmitForm}>
			<label>Friend name</label>
			<input
				type="text"
				value={name}
				onChange={(event) => setName(event.target.value)}
			/>

			<label>Image URL</label>
			<input
				type="text"
				value={image}
				onChange={(event) => setImage(event.target.value)}
			/>
			<Button>Add</Button>
		</form>
	);
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
	const [bill, setBill] = useState("");
	const [paidByUser, setPaidByUser] = useState("");
	const paidByFriend = bill ? bill - paidByUser : "";
	const [isPaying, setIsPaying] = useState("user");

	function handleSubmit(event) {
		event.preventDefault();

		if (!bill || !paidByUser) return;
		onSplitBill(isPaying === "user" ? paidByFriend : -paidByUser);
	}

	return (
		<form className="form-split-bill" onSubmit={handleSubmit}>
			<h2>Split a bill with {selectedFriend.name}</h2>

			<label>Bill Value</label>
			<input
				type="text"
				value={bill}
				onChange={(event) => setBill(Number(event.target.value))}
			/>
			<label>Your expense</label>
			<input
				type="text"
				value={paidByUser}
				onChange={(event) =>
					setPaidByUser(
						Number(event.target.value) > bill
							? bill
							: Number(event.target.value)
					)
				}
			/>
			<label>{selectedFriend.name}'s expense</label>
			<input type="text" disabled value={paidByFriend} />

			<label>Who is paying the bill?</label>
			<select
				value={isPaying}
				onChange={(event) => setIsPaying(event.target.value)}>
				<option value="user">You</option>
				<option value="friend">{selectedFriend.name}</option>
			</select>
			<Button>Split Bill</Button>
		</form>
	);
}
