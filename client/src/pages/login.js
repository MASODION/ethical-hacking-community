import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import Logo from '../images/icon1.png';
//import AppIcon from '../images/nume.png';
//<img src={AppIcon} alt="logo"/>
//6:05:32

//MUI stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';

//Redux
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const styles = {
    form: {
        textAlign: 'center'
    },
    image: {
        margin: '20px auto 20px auto'
    },
    pageTitle: {
        margin: '10px auto 10px auto'
    },
    textField: {
        margin: '10px auto 10px auto'
    },
    button: {
        marginTop: 20,
        position: 'relative'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    infoText: {
        marginTop: 10
    },
    progress: {
        position:'absolute'
    },
    cover: {
        height: 84,
        weight: 84,
    }
}


class login extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            errors: {}
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
          this.setState({ errors: nextProps.UI.errors });
        }
      }
    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData, this.props.history);
   }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    render() {
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state;
        return (
            <Card>
                <CardHeader />
                <CardContent>
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <Typography variant="h3" className={classes.pageTitle}>
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" label="Email / username" className={classes.TextField}
                            helperText={errors.email} error={errors.email ? true : false} value={this.state.email}
                            onChange={this.handleChange} fullWidth/>
                        <TextField id="password" name="password" type="password" label="Password" className={classes.TextField}
                            helperText={errors.password} error={errors.password ? true : false} value={this.state.password} 
                            onChange={this.handleChange} fullWidth/>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            className={classes.button}
                            disabled={loading}
                        >
                            Login
                            {loading && (
                                <CircularProgress size={30} className={classes.progress}/>
                            )}
                        </Button>
                    </form>
                    <p className = {classes.infoText}>Dont have an account? Sign up <Link to="/signup">here</Link>!</p>
                </Grid>
                <Grid item sm/>
            </Grid><br/><br/></CardContent><CardActions/></Card>
        )
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionsToProps = {
    loginUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login))
