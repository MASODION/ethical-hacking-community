import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import Link from 'react-router-dom/Link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import DeletePost from './DeletePost';
import EditPost from './EditPost';
import LikeButton from './LikeButton';
import ReplyButton from './ReplyButton';

//Redux stuff
import { connect } from 'react-redux';


//Mui stuff
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20,
        border: 'none',
        backgroundColor: 'rgb(225, 231, 255)'
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
};


export class Post extends Component {
    render() {
        dayjs.extend(relativeTime); 
        const { 
            classes, 
            post: { 
                postId, 
                title, 
                createdAt, 
                creator, 
                companyName, 
                tags, 
                content,
                likeCount,
                website
            }, 
            user: { 
                authentificated,
                credentials: {
                    userNickName,
                    userType
                }
            }
        } = this.props;
        const deleteButton = authentificated && postId && (creator === userNickName || userType >= 3) ? (
            <DeletePost postId={postId}/>
        ) : null;
        const editButton = authentificated && postId && creator === userNickName ? (
            <EditPost postId={postId} postData={this.props.post}/>
        ) : null;
        const likeButton = authentificated && postId && likeCount >= 0 && creator !== userNickName ? (
            <LikeButton postId={postId} likeCount={likeCount}/>
        ) : null;
        const replyButton = authentificated && postId && userType !== 2 && creator !== userNickName ? (
            <ReplyButton postId={postId}/>
        ) : null;
        const name = authentificated && creator && companyName ? (
            <Typography variant="body1" component={Link} to={`/users/${creator}`} 
                    color="initial">@{creator} - {companyName}</Typography>
        ) : (authentificated && creator ? (
            <Typography variant="body1" component={Link} to={`/users/${creator}`} 
                    color="initial">@{creator}</Typography>
        ) : null);
        return (
            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                    <Typography variant="h5" color="primary">{title}</Typography>
                    <Typography variant="body2" color="textSecondary">{tags}</Typography>
                    <hr/>
                    {name}
                    <hr/>
                    <Typography variant="body1"
                    color="initial"><a href={website} target="_blank" rel="noopener noreferrer">{website}</a></Typography>
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <hr/>
                    <Typography variant="body1">{content}</Typography>
                </CardContent>
                <CardActions className={classes.actions}>
                    {likeButton}
                    {replyButton}
                    {editButton}
                    {deleteButton}
                    </CardActions>
            </Card>
        )
    }
}

Post.propTypes = {
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps)(withStyles(styles)(Post));