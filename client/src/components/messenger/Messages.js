import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios';
import '../../pages/messages.css';
import dayjs from 'dayjs';
import swal from 'sweetalert';



import { connect } from 'react-redux';
import { getUserMessages } from '../../redux/actions/userActions';

//MUI stuff
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const styles = {
    card: {
        display: 'flex',
        marginRight: 'auto',
        marginTop: '10px',
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'rgb(221, 225, 228)',
        minHeight: 50,
        minWidth: 50,
        maxWidth: '60%',
        flexDirection: 'column',
        flexWrap: 'wrap'
    },
    sendcard: {
        marginLeft: 'auto',
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        marginTop: '10px',
        borderBottomLeftRadius: 20,
        maxWidth: '60%',
        borderTopLeftRadius: 20,
        backgroundColor: 'rgb(105, 194, 253)',
        minHeight: 50,
        minWidth: 50,
        whiteSpace: 'pre-wrap',

    },
    sendcardContent: {
        minWidth: '10%',
        textAlign: 'right',
        flex: 1,
        flexWrap: 'wrap',
        whiteSpace: 'pre-wrap',
        padding: 10
    },
    cardContent: {
        minWidth: '10%',
        textAlign: 'left',
        flex: 1,
        flexWrap: 'wrap',
        whiteSpace: 'pre-wrap',
        padding: 10,
        flexDirection: 'column',
        width: '100%',
    },
    paper: {
        postion: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: 8,
        minWidth: '100%',
        height: 570,
        bottom: 0,
    },
    test: {
        display: 'flex',
        flexDirection: 'column-reverse',
        position: 'absolute',
        bottom: 90,
        width: '55%',
        height: 520,
        overflowY: 'scroll',
    },
    test2: {
        position: 'absolute',
        bottom: 31
    },
    textfield: {
        width: 650,
        height: 53
    },
    messagelist: {
        height: 750
    },
    timestamp: {
        fontSize: '12px'
    },
    actions: {
        display: 'flex',
        marginTop: '-12px'
    },
    sendactions: {
        display: 'flex',
        marginTop: '-12px'
    }
};

export class Messages extends Component {
    state = {
        messages: [],
        loading: false
    }
    componentDidMount() {
        this.setState({
            loading: true
        });
        axios.get(`/user/conversation/${this.props.conversationId}/messages`)
                .then((res) => {
                    this.setState({
                        messages: res.data,
                        loading: false
                    })
                })
                .catch((err) => {
                    swal("Oops!", "Something went wrong while trying to get your messages", "error");
                })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            loading: true
        });
        axios.get(`/user/conversation/${nextProps.conversationId}/messages`)
                .then((res) => {
                    this.setState({
                        messages: res.data,
                        loading: false
                    })
                })
                .catch((err) => {
                    swal("Oops!", "Something went wrong while trying to get your messages", "error");
                })
    }
    render() {
        const {
            classes
        } = this.props;
        const {
            credentials: {
                userNickName
            }
        } = this.props.user;
        const {
            messages
        } = this.state;
        const messagesMarkup = !this.state.loading && messages.length > 0 && messages && this.state? (
            messages.map((message) => {
                if(message.sender === userNickName){
                    return (
                        <Card key={message.messageId} className={classes.sendcard}>
                            <CardContent key={message.messageId} className={classes.sendcardContent}>
                                <Typography key={message.messageId}>{message.message}</Typography>
                            </CardContent>
                            <CardActions className={classes.sendactions}>
                                <Typography variant="body1" color="textSecondary" className={classes.timestamp}>{dayjs(message.createdAt).fromNow()}</Typography>
                            </CardActions>
                        </Card>
                    );
                }
                else {
                    return (
                        <Card key={message.messageId} className={classes.card}>
                            <CardContent key={message.messageId} className={classes.cardContent}>
                                <Typography key={message.messageId}>{message.message}</Typography>
                            </CardContent>
                            <CardActions className={classes.actions}>
                                <Typography variant="body1" color="textSecondary" className={classes.timestamp}>{dayjs(message.createdAt).fromNow()}</Typography>
                            </CardActions>
                        </Card>
                    )
                }
            })
        ) : null;
        return (
            <Fragment><div className="message-list-container">{messagesMarkup}</div></Fragment>
        )
    }
}

Messages.propTypes = {
    classes: PropTypes.object.isRequired,
    conversationId: PropTypes.string.isRequired
}

const mapActionsToProps = {
    getUserMessages
}

const mapStateToProps = (state) => ({
    data: state.data,
    user: state.user,
})

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Messages));
