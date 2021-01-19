import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import Link from 'react-router-dom/Link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';


//Mui stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    actions: {
        marginTop: 'auto',
        display: 'flex',
        position: 'absolute',
        bottom: 0,
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


export class PostEnum extends Component {
    render() {
        dayjs.extend(relativeTime); 
        const { 
            classes, 
            post: { 
                postId, 
                title, 
                createdAt,
                companyName, 
                imageUrl, 
                tags,
            }, 
            profileData: { 
                userNickName
            } 
        } = this.props;
        return (
            <Card className={classes.card}>
                <CardHeader/>
                <CardMedia
                    image={imageUrl}
                    title="Profile image"
                    className={classes.image}
                 />
                <CardContent className={classes.cardContent}>
                    <Typography variant="h5" component={Link} to={`/posts/${postId}`} color="primary">{title}</Typography>
                    <Typography variant="body2" color="textSecondary">{tags}</Typography>
                    <hr/>
                    <Typography variant="body1" component={Link} to={`/users/${userNickName}`} 
                    color="initial">{companyName ? companyName : userNickName}</Typography>
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                </CardContent>
            </Card>
        )
    }
}

PostEnum.propTypes = {
    profileData: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PostEnum);
