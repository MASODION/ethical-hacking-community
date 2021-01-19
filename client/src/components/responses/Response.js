import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import Link from 'react-router-dom/Link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import RResponse from './RResponse';
import RResponseSkeleton from '../../util/RResponseSkeleton';
import ReplyButton from './ReplyButton';
import EditReply from './EditReply';
import DeleteReply from './DeleteReply';
import RewardResponse from './RewardResponse';

//Redux stuff
import { connect } from 'react-redux';


//Mui stuff
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ReplyIcon from '@material-ui/icons/Reply';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20,
        border: 'none',
        marginLeft: 50,
        backgroundColor: 'rgb(196, 207, 249)'
    },
    actions: {
        marginTop: 'auto',
        display: 'flex',
        position: 'absolute',
        top: 0,
        right: 0,
    },
    expand: {
        marginLeft: 'auto'
    },
    cardContent: {
        marginTop: '-20px',
        objectFit: 'cover',
        padding: 25,
    },
    cardBottomActions: {
        marginTop: '-30px'
    },
    image: {
        width: 150,
        height: 150,
        maxWidth: '100%',
        borderRadius: '5%',
    },
    coins: {
        color: 'orange'
    }
};


export class Response extends Component 
{
    render() {
        dayjs.extend(relativeTime); 
        const {
            classes,
            response: { 
                responseId,
                title, 
                createdAt,
                content, 
                creator,
                root,
                reward
            }, 
            user: { 
                authentificated,
                credentials: {
                    userNickName,
                    userType
                }
            },
            responseIdParam
        } = this.props;
        const {
            loading,
            postData: {
                postId,
                prize
            },
            responses
        } = this.props.data;
        const rresponsesMarkup = !loading ? (
            responses.map(
                (response) => {
                    return response.rresponseId === responseIdParam && response.root === postId ? (
                        <RResponse key={response.responseId} response={response}/>
                    ) : null;
                })
        ) : (
            <RResponseSkeleton/>
        );
        const replyButton = this.props && authentificated && (creator === userNickName || (userType >= 2 && this.props.data.postData.creator === userNickName)) ? (
            <ReplyButton postId={postId} responseId={responseId}/>
        ) : null;
        const editResponse = this.props && this.props.response && authentificated && creator === userNickName ? (
            <EditReply postId={postId} responseId={responseId} responseData={this.props.response}/>
        ) : null;
        const deleteResponse = this.props && authentificated && (creator === userNickName || userType >= 3) ? (
            <DeleteReply postId={postId} responseId={responseId}/>
        ) : null;
        const rewardButton = this.props && authentificated && this.props.data.postData.creator === userNickName && (reward <= 0 || !reward) ? (
            <RewardResponse responseId={responseId} root={root} postPrize={prize} creator={creator}/>
        ) : null;
        const rewarded = this.props && authentificated && reward > 0 ? (
            <Typography variant="body1" className={classes.coins}>Rewarded: {reward} coins</Typography>
        ) : null;
        return (
            <div>
            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                    <Typography variant="body1" color="textSecondary">
                        <ReplyIcon/> Reply from: @<Typography variant="body1" component={Link} to={`/users/${creator}`} 
                    color="initial">{creator}</Typography>
                    </Typography>
                    <Typography variant="h6" color="primary">{title}</Typography>
                    {rewarded}
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <hr/>
                    <Typography variant="body1">{content}</Typography>
                </CardContent>
                <CardActions className={classes.actions}>
                    {replyButton}
                    {editResponse}
                    {rewardButton}
                    {deleteResponse}
                </CardActions>
            </Card>
            {rresponsesMarkup}
            </div>
        )
    }
}

Response.propTypes = {
    user: PropTypes.object.isRequired,
    response: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    responseIdParam: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data
})

export default connect(mapStateToProps)(withStyles(styles)(Response));
