import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';


//redux
import { connect } from 'react-redux';
import { sendUserMessage } from '../../redux/actions/userActions';


//theme
import '../../pages/messages.css';

//mui stuff
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';



const styles = {
    sendButton: {
        position: 'absolute',
        right: 0,
        height: '6hv'
    }
}

export class SendButton extends Component {
    state = {
        message: '',
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    submitMessage = () => {
        const messageDetails = {
            message: this.state.message,
            sender: this.props.user.credentials.userNickName
        };
        this.props.sendUserMessage(this.props.conversationId, messageDetails);
        this.setState({
            message: ''
        });
    }
    render() {
        const {
            loading,
            conversationId,
            classes
        } = this.props;
        const content = !loading && conversationId && this.props.user && this.state ? (
            <form>
                <TextField
                    name="message"
                    type="text"
                    label="Type a message"
                    className="compose-input"
                    placeholder="Type a message, @name"
                    value={this.state.message}
                    onChange={this.handleChange}
                >
                </TextField>
                <MyButton tip="Send" onClick={this.submitMessage} btnClassName={classes.sendButton}>
                    <SendIcon color="primary" />
                </MyButton>
            </form>
        ) : null;
        return (
            <Fragment>{content}</Fragment>
        )
    }
}

SendButton.propTypes = {
    conversationId: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    sendUserMessage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

const mapActionsToProps = {
    sendUserMessage
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(SendButton))
