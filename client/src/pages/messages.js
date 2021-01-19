import React, { Component } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios';
import Messages from '../components/messenger/Messages';
import './messages.css';
import Conversations from '../components/messenger/Conversations';
import SendButton from '../components/messenger/SendButton';



import { connect } from 'react-redux';
import { getUserMessages } from '../redux/actions/userActions';

//MUI stuff
import Grid from '@material-ui/core/Grid';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 0
    },
    actions: {
        marginTop: 'auto',
        display: 'flex',
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    cardContent: {
        width: '60%',
        flexDirection: 'column',
        padding: 12
    },
    paper: {
        padding: 8,
        minWidth: '100%',
        height: 570
    },
    cover: {
        width: 32,
        height: 32,
        objectfit: 'cover',
        borderRadius: '50%',
        padding: 15,
        marginTop: '15px',
        marginBottom: '15px',
        marginLeft: '15px',
    },
    sendButton: {
        position: 'absolute',
        right: 0,
        height: '6hv'
    }
};

export class messages extends Component {
    state = {
        userAllImages: [],
        conversationIdParams: null
    }
    componentDidMount() {
        if(this.props.match.params.conversationId) {
            this.setState({
                conversationIdParams: this.props.match.params.conversationId
            });
        }
        axios.get('/users/getAllImages')
            .then((res) => {
                this.setState({
                    userAllImages: res.data
                });
            })
            .catch((err) => {
                this.setState({
                    userAllImages: []
                });
            });
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.conversationId) {
            this.setState({
                conversationIdParams: nextProps.match.params.conversationId
            });
        }
    }
    render() {
        const { 
            loading,
         } = this.props;
         const {
            conversations,
            credentials: {
                userNickName
            }
         } = this.props.user;
         const { 
             userAllImages,
             conversationIdParams
         } = this.state;
        const conversationsData = !loading && conversations && userNickName && conversations.length > 0 && userAllImages.length > 0 ? (
            conversations.map((conversation) => {
                let sender = conversation.participants.filter(participant => participant !== userNickName);
                let index = userAllImages.findIndex(user => user.userNickName === sender[0]);
                return (
                    <Conversations key={conversation.conversationId} conversationId={conversation.conversationId} image={userAllImages[index].imageUrl} conversationData={conversation}/>
            )})
        ) : (
            <p>loading...</p>
        );
        const messages = !loading && conversations && userNickName && conversations.length > 0 && this.props.match.params.conversationId ? (
            <Messages conversationId={this.props.match.params.conversationId}/>
        ) : (
            <p>loading...</p>
        );
        const sendZone = !loading && conversationIdParams && this.state ? (
            <SendButton conversationId={conversationIdParams}/>
        ) : null;
        return (
            <Grid container spacing={4}>
                <Grid item sm={4} xs={2}>
                <div className="messengerconv">
                    <div className="scrollable2 content">
                            {conversationsData}
                            </div>
                    </div>
                </Grid>
                <Grid item sm={8} xs={2}>
                    <div className="messenger">
                    <div className="scrollable content">
                    {messages}
                    </div>
                    </div>
                    <div className="messenger2">
                    <div className="compose">
                        {sendZone}
                    </div>
                    </div>
                </Grid>
            </Grid>
        )
    }
}

messages.propTypes = {
    getUserMessages: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapActionsToProps = {
    getUserMessages
}

const mapStateToProps = (state) => ({
    data: state.data,
    user: state.user,
})

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(messages));
