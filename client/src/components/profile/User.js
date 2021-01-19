import React, { Component } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Link from 'react-router-dom/Link';
import dayjs from 'dayjs';
import MessageDialog from '../messenger/MessageDialog';


import {connect} from 'react-redux';

//MUI stuff
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

//Icons
import CalendarToday from '@material-ui/icons/CalendarToday';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import EmailIcon from '@material-ui/icons/Email';


const styles = {
    paper: {
        padding: 20
    },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
        },
        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle'
            }
        },
        '& hr' : {
            border: 'none',
            margin: '0 0 10px 0'
        },
        '& svg.button': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    },
    buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    },
    coins: {
        color: 'orange',
        marginLeft: 2,
    },
    email: {
        marginLeft: 2,
    },
    standUser: {
        color: 'blue',
    },
    adminUser: {
        color: 'red',
    },
    companyUser: {
        color: 'orange',
    },
    table: {
        minWidth: 30,
        width: 300,
        textAlign: 'center',
        position: 'center',
    },
};

export class User extends Component {
    render() {
        const {
            profileData: {
                userNickName, 
                userType,
                imageUrl,
                bio,
                userCoins,
                email,
                companyName,
                createdAt
            },
            classes
        } = this.props;
        let rank = userType === 1 ? (
            <Typography variant="body2" className={classes.standUser}>[Standard User]</Typography>
        ) : (userType === 2 ? (
            <Typography variant="body2" className={classes.companyUser}>[Company]</Typography>
        ) : (userType === 3 ? (
            <Typography variant="body2" className={classes.adminUser}>[Moderator]</Typography>
        ) : (userType === 4 ? (
            <Typography variant="body2" className={classes.adminUser}>[Administrator]</Typography>
        ) : (
            <Typography variant="body2" className={classes.standUser}>[Standard User]</Typography>
        ))));
        let company = userType === 2 ? (
            <Typography variant="h6">{companyName}</Typography>
        ) : null;
        let sendMessageButton = this.props.user.credentials.userNickName !== userNickName && this.props.user.credentials.userNickName ? (
            <MessageDialog sender={this.props.user.credentials.userNickName} recipient={userNickName} />
        ) : null;
        return (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={imageUrl} alt="profile" className="profile-image"></img>
                    </div>
                <hr/>
                <div className="profile-details">
                    Bio: {bio}
                    <hr/>
                    {company}
                    <MuiLink component={Link} to={`/users/${userNickName}`} color="primary" variant="h5">
                        @{userNickName}
                    </MuiLink>
                    {rank}
                    <hr/>
                    <LoyaltyIcon color="primary"/>
                    <span className={classes.coins}>{userCoins} coins</span>
                    <hr/>
                    <EmailIcon color="primary"/>
                    <span className={classes.email}>{email}</span>
                    <hr/>
                    <CalendarToday color="primary"/>{' '}
                    <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                    <hr/>
                    <span>{sendMessageButton}</span>
                </div>
                </div>
            </Paper>
        )
    }
}

User.propTypes = {
    classes: PropTypes.object.isRequired,
    profileData: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(User))
