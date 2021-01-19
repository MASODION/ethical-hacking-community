import React, { Fragment } from 'react'
import NoImg from '../images/no-img.png';
import PropTypes from 'prop-types';

//Mui stuff
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = {
    paper: {
        padding: 20,
    },
    cover: {
        width: 200,
        height: 200,
        objectFit: 'cover',
        maxWidth: '100%',
        borderRadius: '50%',
        marginBottom: 10
    },
    profile: {
        textAlign: 'center',
        padding: 15
    },
    title: {
        height: 15,
        width: '30%',
        marginLeft: '35%',
        backgroundColor: 'rgba(0,0,0, 0.6)',
        marginBottom: 10
      },
    smalltext: {
        height: 15,
        width: '20%',
        marginLeft: '40%',
        backgroundColor: 'rgba(0,0,0, 0.6)',
        marginBottom: 10
    },
};

const ProfileSkeleton = (props) => {
    const { classes } = props;

    const content = (
        <Paper>
            <div className={classes.profile}>
                <img src={NoImg} alt="profile" className={classes.cover}></img>
                <div className={classes.title}></div>
                <div className={classes.smalltext}></div>
                <div className={classes.smalltext}></div>
                <div className={classes.smalltext}></div>
                <div className={classes.smalltext}></div>
                <div className={classes.smalltext}></div>
                <div className={classes.smalltext}></div>
                <div></div>
            </div>
        </Paper>
    )

    return <Fragment>{content}</Fragment>
}

ProfileSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ProfileSkeleton)
