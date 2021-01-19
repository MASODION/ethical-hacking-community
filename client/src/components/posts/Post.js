import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import Link from 'react-router-dom/Link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import DeletePost from './DeletePost';
import EditPost from './EditPost';
import LikeButton from './LikeButton';

//Redux stuff
import { connect } from 'react-redux';


//Mui stuff
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

//icons

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: '20px'
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
        padding: 15
    },
    cover: {
        minWidth: 180,
        minHeight: 150,
        objectfit: 'cover'
    },
    coins: {
        color: 'orange'
    }
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
                imageUrl, 
                tags, 
                likeCount,
                prize 
            }, 
            user: { 
                authentificated,
                credentials: {
                    userNickName,
                    userType
                }
            } 
        } = this.props;
        const deleteButton = authentificated && (creator === userNickName || userType >= 3) ? (
            <DeletePost postId={postId}/>
        ) : null;
        const editButton = authentificated && (creator === userNickName) ? (
            <EditPost postId={postId} postData={this.props.post}/>
        ) : null;
        const likeButton = authentificated && likeCount >= 0 && postId ? (
            <LikeButton postId={postId} likeCount={likeCount}/>
        ) : null;
        return (
            <Card className={classes.card}>
                <CardMedia
                    image={imageUrl}
                    title="Profile image"
                    className={classes.cover}
                 />
                <CardContent className={classes.cardContent}>
                    <Typography variant="h5" component={Link} to={`/posts/${postId}`} color="primary">{title}</Typography>
                    <Typography variant="body2" color="textSecondary">{tags}</Typography>
                    <Typography variant="body1" className={classes.coins}>{prize} coins</Typography>
                    <hr/>
                    <Typography variant="body1" component={Link} to={`/users/${creator}`} 
                    color="initial">{companyName ? companyName : creator}</Typography>
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                </CardContent>
                <CardActions className={classes.actions}>
                    {likeButton}
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
