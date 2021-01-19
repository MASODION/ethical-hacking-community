import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';


//Redux
import { connect } from 'react-redux';
import { sendMessage } from '../../redux/actions/userActions';

//MUI stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';


//icons
import MessageIcon from '@material-ui/icons/Message';


const styles = {
    button: {
        color: 'inherit'
    }
};

export class MessageDialog extends Component {
    state = {
        message: '',
        recipient: '',
        sender: '',
        lastMessage: '',
        errors: {},
        open: false
    };
    componentDidMount() {
        this.setState({
            recipient: this.props.recipient,
            sender: this.props.sender
        });
    }
    handleOpen = () => {
        this.setState({
            open: true
        });
    }
    handleClose = () => {
        this.setState({
            open: false
        });
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    sendNewMessage = () => {
        const lastMessage = `${this.state.sender}: ${this.state.message}`;
        const newMessageDetails = {
            message: this.state.message,
            recipient: this.state.recipient,
            sender: this.state.sender,
            lastMessage: lastMessage
        };
        this.props.sendMessage(newMessageDetails);
        this.handleClose();
        this.setState({
            message: '',
            errors: {},
            open: false
        });
    }
    render() {
        const { classes, } = this.props;
        const { errors } = this.state;
        return (
            <Fragment>
                <MyButton tip="Send a message" btnClassName={classes.button} onClick={this.handleOpen}>
                    <MessageIcon color="inherit"/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Send a message
                    </DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name="message"
                                type="text"
                                label="Message"
                                multiline
                                rows="5"
                                placeholder="Type your message here"
                                className={classes.texfield}
                                value={this.state.message}
                                onChange={this.handleChange}
                                helperText={errors.message}
                                error={errors.message ? true : false}
                                fullWidth>
                            </TextField>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.sendNewMessage} color="primary">
                            Send
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

MessageDialog.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    sender: PropTypes.string.isRequired,
    recipient: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
    UI: state.UI
})

export default connect(mapStateToProps, { sendMessage })(withStyles(styles)(MessageDialog))
