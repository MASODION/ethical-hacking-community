import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';
import MyButton from '../../util/MyButton';
import ProfileSkeleton from '../../util/ProfileSkeleton';

//Redux stuff
import { connect } from 'react-redux';
import { uploadImage } from '../../redux/actions/userActions';


//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


//ICONS
import CalendarToday from '@material-ui/icons/CalendarToday';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import EditIcon from '@material-ui/icons/Edit';
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


export class Profile extends Component {
    handleImageChange = (event) => {
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        this.props.uploadImage(formData);
    };

    handleEditPicture= () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    };

    render() {
        const { 
            classes, 
            user: { 
                credentials: { userNickName, createdAt, imageUrl, bio, userCoins, userType, email, companyName }, 
                loading,
                authentificated
            }
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

        let profileMarkup = !loading ? (authentificated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={imageUrl} alt="profile" className="profile-image"></img>
                        <input type="file" id="imageInput" onChange={this.handleImageChange} hidden="hidden"/>
                        <MyButton tip="Edit profile picture" onClick={this.handleEditPicture}>
                            <EditIcon color="primary"/>
                        </MyButton>
                    </div>
                <hr/>
                <div className="profile-details">
                    Bio: {bio} <EditDetails className={classes.editDetails}/>
                    <hr/>
                    <MuiLink component={Link} to={`/users/${userNickName}`} color="primary" variant="h5">
                        @{userNickName}
                    </MuiLink>
                    {company}
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
                </div>
                </div>
            </Paper>
        ) : (
            <Paper className={classes.paper}>
                <Typography variant="body2" align="center">
                    No profile found, please login again
                </Typography>
                <div className={classes.buttons}>
                    <Button variant="contained" color="primary" component={Link} to="/login">
                        Login
                    </Button>
                    <Button variant="contained" color="secondary" component={Link} to="/signup">
                        Signup
                    </Button>
                </div>
            </Paper>
        )) : (
            <ProfileSkeleton />
        );

        return profileMarkup;
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = { uploadImage };

Profile.propTypes = {
    uploadImage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile))
