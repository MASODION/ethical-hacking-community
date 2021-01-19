import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import Link from 'react-router-dom/Link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';


//Mui stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ReplyIcon from '@material-ui/icons/Reply';
import MuiLink from '@material-ui/core/Link';


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
    coins: {
        color: 'orange'
    }
};


export class ResponseEnum extends Component {
    render() {
        dayjs.extend(relativeTime); 
        const { 
            classes, 
            responseData: { 
                title, 
                createdAt,
                root,
                content,
                reward
            }, 
            profileData: { 
                userNickName
            } 
        } = this.props;
        const rewarded = reward && reward > 0 ? (
            <Typography variant="body1" className={classes.coins}>Rewarded: {reward} coins</Typography>
        ) : null;
        return (
            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                    <Typography variant="body1" color="textSecondary">
                        <ReplyIcon/> Reply to: <MuiLink component={Link} to={`/posts/${root}`} color="primary" variant="body1">{root}</MuiLink>
                    </Typography>
                    <Typography variant="h6" color="primary">{title}</Typography>
                    {rewarded}
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <hr/>
                    <Typography variant="body1">{content}</Typography>
                </CardContent>
            </Card>
        )
    }
}

ResponseEnum.propTypes = {
    profileData: PropTypes.object.isRequired,
    responseData: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ResponseEnum);
