import React, { Fragment } from 'react'
import PropTypes from 'prop-types';

//Mui stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import withStyles from '@material-ui/core/styles/withStyles';



const styles = {
    card: {
        display: 'flex',
        marginBottom: '20px',
        marginLeft: 50
    },
    cardContent: {
        width: '100%',
        flexDirection: 'column',
        padding: 25
    },
    user: {
        width: 60,
        height: 20,
        marginButton: 7
    },
    date: {
      height: 14,
      width: 100,
      backgroundColor: 'rgba(0,0,0, 0.3)',
      marginBottom: 10
    },
    content: {
        height: 15,
        width: '90%',
        backgroundColor: 'rgba(0,0,0, 0.3)',
        marginBottom: 10
    },
    title: {
      height: 15,
      width: '90%',
      backgroundColor: 'rgba(0,0,0, 0.6)',
      marginBottom: 10
    },
    tags: {
      height: 15,
      width: '50%',
      backgroundColor: 'rgba(0,0,0, 0.6)',
      marginBottom: 10
    }
};

const ResponseSkeleton = (props) => {
    const { classes } = props;

    const content = Array.from({ length: 3}).map((item, index) => (
        <Card className={classes.card} key={index}>
            <CardContent className={classes.cardContent}>
                <div className={classes.title}/>
                <div className={classes.tags}/>
                <div className={classes.user}/>
                <div className={classes.date}/>
                <div className={classes.content}/>
            </CardContent>
        </Card>
    ));

    return <Fragment>{content}</Fragment>
}

ResponseSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ResponseSkeleton)
