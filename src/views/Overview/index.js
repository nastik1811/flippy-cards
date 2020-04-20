import React, {useState, useEffect, useContext} from 'react'
import Card from './Card'
import {useParams} from 'react-router-dom'
import styles from './Overview.module.scss'
import { DataContext } from '../../DataManger'

const SessionInfo = ({name, left}) => {
    return (
        <div className={styles["session-info"]}>
            <div>
                <div className={styles["title"]}>{name}</div>
                <div className={styles["detail"]}>{left} cards left</div>
            </div>
            <Timer time = "0:20"/>
        </div>
    )
}

const Timer = ({time}) => {
    return(<div className={styles["passed-time"]}> {time}</div>)
}

const Overview = () => {
    let {slug} = useParams();
    const {manager} = useContext(DataContext);
    const collection_id = slug ? slug : null;
    
    const [collection, setCollection] = useState(null);
    const [cards, setCards] = useState(null);

    const [currentCardIndex, setCardIndex] = useState(0);
    const [isFlipped, setFlipped] = useState(false);
    const [left, setLeft] = useState(0);

    console.log(collection_id)
    useEffect(()=> {
        manager.getCardsToRecall(collection_id).then(data => {
            setCards(data);
            setLeft(data.length - 1)
        })
    }, [manager, collection_id])

    //have no idea how to do it better
    useEffect(() => {
        collection_id ?
        manager.getCollection(collection_id).then(data => setCollection(data)) : setCollection(null);
    }, [manager, collection_id])
    
    const handleClick = () => {
        if(left !== 0 ){
            setFlipped(false);
            setCardIndex(currentCardIndex + 1);
            setLeft(left - 1);
        }
        else{
            alert("It is the last card. Please return to home.")
        }
    }

    return (
        cards?
            <div>
                <SessionInfo name={collection ? collection.name : "All cards"} left = {left} />
                <Card card={cards[currentCardIndex]} onClick={() => setFlipped(true)} isFlipped={isFlipped}/>
                <div className={ isFlipped? styles["buttons-panel"]: styles["buttons-panel-hidden"]} >
                    <button className="" onClick={handleClick}>Fail</button>
                    <button className="" onClick={handleClick}>Win</button>
                </div>
            </div>
            :
            <div>Loading ...</div>
        )
}

export default Overview;