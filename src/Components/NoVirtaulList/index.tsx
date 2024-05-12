import React, { useState } from "react";

type ContactProps = {
  id: number;
  name: string;
  avatar: string;
}
const Contact: React.FC<ContactProps> = (contact) => (
  <div style={styles.contact}>
    <img src={contact.avatar} alt={contact.name} style={styles.avatar} />
    <div style={styles.details}>
      <h3>{contact.name}</h3>
      <p>ID: {contact.id}</p>
    </div>
  </div>
);

function App() {
  const [size, setSize] = useState(1000);

  const contacts = Array.from({ length: size }, (_, index) => ({
    id: index + 1,
    name: `Contact ${index + 1}`,
    avatar: `https://i.pravatar.cc/70?img=${Math.floor(Math.random() * 70)}`,
  }));

  return (
    <div style={styles.container}>
      <h1 style={styles.header as any}>No Virtual List - Size {size}</h1>
      <input value={size} onChange={(e) => setSize(e.target.value as any)}/>
      {contacts.map((contact) => (
        <Contact key={contact.id} {...contact} />
      ))}
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
