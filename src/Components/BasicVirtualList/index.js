import React, { useState } from "react";
import VirtualList from "./VirtualList";



const Contact = ({ contact }) => (
  <div style={styles.contact}>
    <img src={contact.avatar} alt={contact.name} style={styles.avatar} />
    <div style={styles.details}>
      <h3>{contact.name}</h3>
      <p>ID: {contact.id}</p>
    </div>
  </div>
);

function App() {
  const [size, setSize] = useState(10000);

  const contacts = Array.from({ length: size }, (_, index) => ({
    id: index + 1,
    name: `Contact ${index + 1}`,
    avatar: `https://i.pravatar.cc/50?img=${index % 50 + 1}`,
  }));

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Basic Virtual List  - Size {size}</h1>
      <input value={size} onChange={(e) => setSize(e.target.value)}/>      
      <VirtualList
        itemCount={contacts.length}
        height={500}
        childHeight={114}
        Item={({ index }) => <Contact contact={contacts[index]} />}
      />
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 600,
    margin: "0 auto",
    padding: 20,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  contact: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
    padding: "10px 0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    marginRight: 20,
  },
  details: {
    flexGrow: 1,
  },
};

export default App;
