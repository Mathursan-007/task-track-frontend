import React from 'react';
import CreateCard from '../components/CreateCard';
import ToDoCardContainer from'./ToDoCardContainer'
import axios from 'axios'


class MainContainer extends React.Component{


    state={
        cards:[],
        lists:[],
        File:''
    }

    fileHandler=(e)=>{

         this.setState({File:e.target.files[0]})

    }

    createNewCard=(input)=>{

        fetch('https://task-track-backend.herokuapp.com/card',{
            method:'POST',
            headers:{
                'Content-type':'application/json',
            },
            body:JSON.stringify({
                title:input
            })
        })
            .then(res=>(res.json()))
             .then(newCard=>{
                this.setState({
                    cards:[...this.state.cards,newCard]
                })
            }).catch(e=>{
                console.log(e)
        })


    }


    addList=(cardID,input)=> {
        fetch('https://task-track-backend.herokuapp.com/card/lists', {
            method: 'POST',
            headers: {

                'Content-type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                description: input,
                card_ID: cardID,
                completed: false
            })
        })
            .then(resp => resp.json())
            .then(newList => {
                const foundCard = {...this.state.cards.find(card => card.id == cardID)}
                foundCard.lists = [...foundCard.lists, newList]

                const newCards = this.state.cards.map(card => {
                    if (card.id == cardID) {
                        return foundCard;
                    } else {
                        return card;
                    }
                })

                this.setState({
                    cards: newCards
                })
            })

        const fd= new FormData();
        fd.append("File",this.state.File)

        axios.post('https://task-track-backend.herokuapp.com/card/add', fd)
            .then(res => console.log(res))

    }

    componentDidMount() {

        fetch('https://task-track-backend.herokuapp.com/card',{
            method:"GET"
        })
            .then(resp=>resp.json())
            .then(cards=>{
                this.setState({
                    cards:cards
                })
            }).catch(e=>{
                console.log(e)
        })

    }

    handleClickList =(cardID,listID)=>{

        const foundCard = {...this.state.cards.find(card=>card.id==cardID)}
        const foundList = foundCard.lists.find(list=>list.id==listID)

        let newState =null;

        if(foundList.completed){
            newState=false;
        }else{
            newState=true;
        }

        fetch(`https://task-track-backend.herokuapp.com/card/lists/${listID}`,{
            method:"PATCH",
            headers:{
                'Content-type':'application/json',
                Accept:'application/json'
            },
            body:JSON.stringify({
                completed:newState
            })
        })
            .then(res => res.json())
            .then(newList => {
                const newLists = foundCard.lists.map(list=> {
                    if (list.id == listID) {
                        return newList
                    } else {
                        return list
                    }
                })

                foundCard.lists = newLists

                const newCards = this.state.cards.map(card => {
                    if(card.id == cardID){
                        return foundCard
                    }else {
                        return card
                    }
                })

                this.setState({
                    cards:newCards
                })
            })

    }



    render() {
        return(
            <div className="main-container">
                <input
                    type="file"
                    accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                             application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    name="File"
                    onChange={this.fileHandler}
                />
                <ToDoCardContainer cards={this.state.cards} addList={this.addList} handleClickList={this.handleClickList}/>
                    <CreateCard createNewCard ={this.createNewCard}/>
            </div>
        )
    }


}


export default MainContainer;