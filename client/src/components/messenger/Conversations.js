import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Link from 'react-router-dom/Link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';



import { connect } from 'react-redux';

//MUI stuff
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginTop: '8px',
        backgroundColor: 'rgb(221, 225, 228)',
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
        marginTop: '5px',
        marginBottom: '5px',
        marginLeft: '5px',
    },
    sendButton: {
        position: 'absolute',
        right: 0,
        height: '6hv'
    },
    timestamp: {
        fontSize: '12px'
    }
};

export class Conversations extends Component {
    render() {
        dayjs.extend(relativeTime); 
        const { 
            loading,
            classes,
            conversationData,
            image,
            conversationId
         } = this.props;
         const {
            credentials: {
                userNickName
            }
         } = this.props.user;
        const conversationsData = !loading && this.props && image && conversationId && conversationData ? (
            <Card className={classes.card} component={Link} to={`/messages/t/${conversationId}`}>
                    <CardMedia
                    image={image}
                    title="Profile image"
                    className={classes.cover}
                    />
                <CardContent className={classes.cardContent}>
                <Typography component={Link} to={`/users/${conversationData.participants.filter(participant => participant !== userNickName)}`}>@{conversationData.participants.filter(participant => participant !== userNickName)}</Typography>
                <Typography variant="body1" color="textSecondary">{conversationData.lastMessage.substring(0, userNickName.length) === userNickName ? (`You: ${conversationData.lastMessage.substring(userNickName.length+1, 25 + userNickName.length)}`) : (`${conversationData.lastMessage}`)}</Typography>
                </CardContent>
                <CardActions className={classes.actions}>
                <Typography variant="body1" color="textSecondary" className={classes.timestamp}>{dayjs(conversationData.createdAt).fromNow()}</Typography>
                </CardActions>
                </Card>
        ) : (
            <p>loading...</p>
        );
        return (
            <Fragment>{conversationsData}</Fragment>
        )
    }
}
Conversations.propTypes = {
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    image: PropTypes.string.isRequired,
    conversationId: PropTypes.string.isRequired,
    conversationData: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
    data: state.data,
    user: state.user,
})

export default connect(mapStateToProps)(withStyles(styles)(Conversations));
