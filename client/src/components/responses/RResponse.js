import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import Link from 'react-router-dom/Link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';

//Redux stuff
import { connect } from 'react-redux';


//Mui stuff
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ReplyAllIcon from '@material-ui/icons/ReplyAll';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20,
        border: 'none',
        marginLeft: 100,
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
};


export class RResponse extends Component {
    render() {
        dayjs.extend(relativeTime); 
        const { 
            classes, 
            response: { 
                rresponseId, 
                title, 
                createdAt,
                content, 
                creator
            }, 
            user: { 
                authentificated,
                credentials: {
                    userNickName,
                    userType
                }
            } 
        } = this.props;
        return (
            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                    <Typography variant="body1" color="textSecondary">
                        <ReplyAllIcon/> Reply from: @<Typography variant="body1" component={Link} to={`/users/${creator}`} 
                    color="initial">{creator}</Typography>
                    </Typography>
                    <Typography variant="h6" color="primary">{title}</Typography>
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <hr/>
                    <Typography variant="body1">{content}</Typography>
                </CardContent>
                <CardActions className={classes.actions}>

                </CardActions>
            </Card>
        )
    }
}

RResponse.propTypes = {
    user: PropTypes.object.isRequired,
    response: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps)(withStyles(styles)(RResponse));
