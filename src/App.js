import React, { Component } from 'react';
import Square from './Square';
import Particles from 'react-particles-js';
import { fetchGameState, updateServerState, registerGameOnServer, leaveGameEvent, endGameEvent, leaveRoom } from './api';
import './App.css';
import NavigationBar from "./NavigationBar";
import CustomModal from './CustomModal';

class App extends Component {
    constructor(props){
        super(props);
        this.gameRegisterHandle = this.gameRegisterHandle.bind(this);
        this.state = {
          values: Array(9).fill(null),
          isXNext: true,

          selectedOption: null, //To keep account of the option chosen in a Modal

          gameRole: null,   //game state
          gameId: null, //to find game state

          showModal: false,   //these are modal states from here
          gameKeys: [],
          modalMessage: 'Default message',
        };
        fetchGameState((tableValues, isXNext) => this.setState({
            values: tableValues,
            isXNext: isXNext
        }));
        endGameEvent((prevGameKey) => {
            this.setState({
                values: Array(9).fill(null),
                isXNext: true,

                selectedOption: null,

                gameRole: null,
                gameId: null,

                showModal: false,
                gameKeys: [],
                modalMessage: 'Default message',
            });
            leaveRoom(prevGameKey);    //After all the states are reset - Leave room
        });
    }

    handleClick(i) {
        let role = this.state.gameRole;
        if (role === 'host' && this.state.isXNext)
        {
            const modifiedValuesArray = this.state.values.slice();
            modifiedValuesArray[i] = 'X';
            this.setState({
                values: modifiedValuesArray,
            });
            let obj = {
                gameKey: this.state.gameId,
                arrayValues: modifiedValuesArray,
                gameRole: role
            };
            updateServerState(obj);
        }
        else if (role === 'tenant' && !(this.state.isXNext))
        {
            const modifiedValuesArray = this.state.values.slice();
            modifiedValuesArray[i] = 'O';
            this.setState({
                values: modifiedValuesArray,
            });
            let obj = {
                gameKey: this.state.gameId,
                arrayValues: modifiedValuesArray,
                gameRole: role
            };
            updateServerState(obj);
        }
        // const modifiedValuesArray = this.state.values.slice();
        // // modifiedValuesArray[i] = this.state.isXNext ? 'X' : 'O';
        // modifiedValuesArray[i] = this.state.isXNext ? 'X' : 'O';
        // this.setState({
        //     values: modifiedValuesArray,
        //     isXNext: !this.state.isXNext
        // });
        // let obj = {
        //     arrayValues: modifiedValuesArray
        // };
        // updateServerState(obj);
    }

    handleModalState(show, message, options) {
        this.setState({
            showModal: show,
            gameKeys: options,
            modalMessage: message
        });
    }

    setGameId(selectedOption) {
        this.setState({ gameId: selectedOption }, () => {this.gameRegisterHandle()});
    }

    setModalSelectOption(selectedOption) {
        this.setState({selectedOption});
    }

    setGameRole(role) {
        this.setState({
            gameRole: role
        });
    }

    leaveGame(){
        let obj = {
            gameKey: this.state.gameId,
            gameRole: this.state.gameRole
        };
        leaveGameEvent(obj);
    }

    showModal(show) {
        this.setState({showModal: show});
    }

    gameRegisterHandle() {
        let obj={
            gameKey: this.state.gameId,
            role: this.state.gameRole
        };
        registerGameOnServer(obj);
    }

    renderSquare(i) {
        return (
          <Square value = { this.state.values[i] } onClick = { () => this.handleClick(i) }/>
        );
    }

    calculateWinner(values) {
        const winningLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let i = 0; i < winningLines.length; i++) {
            const [a, b, c] = winningLines[i];
            if (values[a] && values[a] === values[b] && values[a] === values[c]) {
                return values[a];
            }
        }
        return null;
    }

    render() {
        const winner = this.calculateWinner(this.state.values);
        console.log(this.state);
        let div;
        if(this.state.gameId) {
            div = <button className="btn-primary leaveButton" onClick={() => this.leaveGame()}>Leave Game</button>;
        } else {
            div = <NavigationBar handleModal={(show, message, options) => this.handleModalState(show, message, options)}
                                 setGameRole={(role) => this.setGameRole(role)}
            />;
        }
        return (
            <div className="container-fluid">
                <div className="row content">
                    <div className="col-sm-12 App">
                        <Particles/>
                        {/*<NavigationBar handleModal={(show, message, options) => this.handleModalState(show, message, options)}*/}
                                       {/*setGameRole={(role) => this.setGameRole(role)}*/}
                        {/*/>*/}
                        {div}
                        <CustomModal show={this.state.showModal} options={this.state.gameKeys} message={this.state.modalMessage} selectedOption={this.state.selectedOption}
                                     setGameId={(selectedOption) => this.setGameId(selectedOption)}
                                     setSelectedOption={(selectedOption) => this.setModalSelectOption(selectedOption)} showModal={(show) => this.showModal(show)}
                                     registerGameOnServer={() => this.gameRegisterHandle()}
                        />
                        <div className="containment">
                            <div className="status">{winner ? "Winner " + winner : this.state.isXNext ? "X's turn!" : "O's turn!"}</div>
                            <div className={"board-row"}>
                                {this.renderSquare(0)}
                                {this.renderSquare(1)}
                                {this.renderSquare(2)}</div>
                            <div className={"board-row"}>
                                {this.renderSquare(3)}
                                {this.renderSquare(4)}
                                {this.renderSquare(5)}</div>
                            <div className={"board-row"}>
                                {this.renderSquare(6)}
                                {this.renderSquare(7)}
                                {this.renderSquare(8)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
