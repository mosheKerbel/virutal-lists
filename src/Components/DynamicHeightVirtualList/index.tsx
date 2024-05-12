import VirtualList from "./VirtualList";

const contactStyles = {
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxSizing: "border-box"
};
const contactDetailsStyles = {
    display: "flex",
    flexDirection: "column",
};
const avatarStyles = {
    borderRadius: "50%",
};

const getRandomNum = (start: number, end: number) => {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

const App = () => {
    const size = 10000;
    const getItemHeight = (itemId: number) => contactsData[itemId].height;

    const contactsData = [...Array(size)].map((_, i) => ({
        id: i + 1,
        age: getRandomNum(20, 40),
        avatarSrc: `https://i.pravatar.cc/50?img=${getRandomNum(1, 50)}`,
        height: getRandomNum(30, 80),
    }));

    const Contact: React.FC<{id: number}> = ({id}) => {
        const contact = contactsData[id];
        return (
            <div style={Object.assign({height: contact.height}, contactStyles as any)}>
                <img style={Object.assign({height: contact.height}, avatarStyles as any)} src={contact.avatarSrc}/>
                <div style={contactDetailsStyles as any}>
                    <span>ID: {contact.id}</span>
                    <span>Age: {contact.age}</span>
                </div>
            </div>
        );
    }
    return (
        <>
            <h2>Dynamic Height Virtual List</h2>
            <VirtualList 
                itemsCount={contactsData.length} 
                getItemHeight={getItemHeight} 
                listHeight={500} 
                itemRender={Contact}/>
        </>
    )
}

export default App;
