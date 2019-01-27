import React, { Component } from 'react';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';

class CustomModal extends React.Component {
    constructor(props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        // this.state = {
        //     selectedOption: null
        // };
    }

    handleClose() {
        this.props.showModal(false);
    }

    handleShow() {
        this.props.showModal(true);
    }

    render() {
        return (
            <div>
                <Modal show={this.props.show} onHide={this.handleClose}>
                    {/*<Modal.Header closeButton>*/}
                        {/*<Modal.Title>Modal heading</Modal.Title>*/}
                    {/*</Modal.Header>*/}
                    <Modal.Body>
                        {/*<h4>Text in a modal</h4>*/}
                        <p>
                            {this.props.message}
                        </p>
                        <Select
                            value={this.props.selectedOption}
                            onChange={(selectedOption) => { this.props.setSelectedOption(selectedOption); }}
                            // value={this.state.selectedOption}
                            // onChange={(selectedOption) => { this.setState(selectedOption); }}
                            options={this.props.options}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={() => {
                            this.props.setGameId(this.props.selectedOption.value);
                            // this.props.registerGameOnServer();
                        }}>Save</Button>
                        <Button onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default CustomModal;