import React, { Component } from 'react';
import { getGameRoomsStatus, setGameRoomsStatus } from './api';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

// const options = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' }
// ];

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.handleState = this.handleState.bind(this);
        this.state = {
            gameRooms: []
        };
        setGameRoomsStatus((array) => this.handleState(array));
    }

    handleState(status) {
        let role = status.role;
        let gameRooms = status.arrayValues.map(x => {
            let obj={};
            obj['label'] = x;
            obj['value'] = x;
            return obj;
        });
        this.setState({gameRooms}, () => {
            if (role === 'host')
            {
                this.props.handleModal(true, 'Choose a game room to host!', this.state.gameRooms);
            }
            else if (role === 'tenant')
            {
                this.props.handleModal(true, 'Choose a game room to join and play!', this.state.gameRooms);
            }
            else if (role === 'viewer')
            {
                this.props.handleModal(true, 'Choose a game room to view game!', this.state.gameRooms);
            }
        });
    }

    render() {
        const navigationBar = {
            background: '#424242',
            fontFamily: 'monospace'
        };
        return (
            <div>
                <SideNav style={navigationBar}
                         onSelect={(selected) => {
                             getGameRoomsStatus(selected);
                             this.props.setGameRole(selected);
                         }}
                >
                    <SideNav.Toggle />
                    <SideNav.Nav defaultSelected="home">
                        <NavItem eventKey="home">
                            <NavIcon>
                                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                Home
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="host">
                            <NavIcon>
                                <i className="fa fa-fw fa-server" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                Host Game
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="tenant">
                            <NavIcon>
                                <i className="fa fa-fw fa-user-plus" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                Join Game
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="viewer">
                            <NavIcon>
                                <i className="fa fa-fw fa-eye" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                Watch Game
                            </NavText>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>
            </div>
        );
    }
}

export default NavigationBar;
