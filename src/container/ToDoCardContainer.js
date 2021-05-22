import React from "react";
import ToDoCard from '../components/ToDoCard';

function ToDoCardContainer(props){


    function renderCards(){

        return props.cards.map(card=>{
            return <ToDoCard key={card.id} card={card} addList={props.addList} handleClickList={props.handleClickList}/>
        })

    }

    return(

        <div className={"to-do-list-container"}>
            {renderCards()}
        </div>

    )

}

export default ToDoCardContainer;