import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
//import AppIcon from '../images/nume.png';
//<img src={AppIcon} alt="logo"/>
//5:46:00

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
import { signupUser } from '../redux/actions/userActions';

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
    }
}

class signup extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            userNickName: '',
            invitationId: '',
            companyName: '',
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
        this.setState({
            loading: true
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            userNickName: this.state.userNickName,
            userCoins: 0,
            userType: 1,
            likesCount: 0,
            unreadMessages: 0,
            unreadNotifications: 0,
            invitationId: this.state.invitationId,
            companyName: this.state.companyName
        };
        this.props.signupUser(newUserData, this.props.history);
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
                        Signup
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField 
                            id="userNickName" 
                            name="userNickName" 
                            type="text" 
                            label="User Nickname" 
                            className={classes.textField}
                            helperText={errors.userNickName} 
                            error={errors.userNickName ? true : false} 
                            value={this.state.userNickName}
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <TextField 
                            id="companyName" 
                            name="companyName" 
                            type="text" 
                            label="Company name (leave black if you are a normal user)" 
                            className={classes.textField}
                            helperText={errors.companyName} 
                            error={errors.companyName ? true : false} 
                            value={this.state.companyName}
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <TextField 
                            id="email" 
                            name="email" 
                            type="email" 
                            label="Email" 
                            className={classes.textField}
                            helperText={errors.email} 
                            error={errors.email ? true : false} 
                            value={this.state.email}
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <TextField 
                            id="password" 
                            name="password" 
                            type="password" 
                            label="Password" 
                            className={classes.textField}
                            helperText={errors.password} 
                            error={errors.password ? true : false} 
                            value={this.state.password} 
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <TextField 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type="password" 
                            label="Confirm Password" 
                            className={classes.textField}
                            helperText={errors.confirmPassword} 
                            error={errors.confirmPassword ? true : false} 
                            value={this.state.confirmPassword} 
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <TextField 
                            id="invitationId" 
                            name="invitationId" 
                            type="text" 
                            label="Invitation ID" 
                            className={classes.textField}
                            helperText={errors.invite} 
                            error={errors.invite ? true : false} 
                            value={this.state.invitationId} 
                            onChange={this.handleChange} 
                            fullWidth
                        />
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
                            Signup
                            {loading && (
                                <CircularProgress size={30} className={classes.progress}/>
                            )}
                        </Button>
                    </form>
                    <p className = {classes.infoText}>
                        Already have an account? Sign in <Link to="/login">here</Link>!
                    </p>
                </Grid>
                <Grid item sm/>
            </Grid><br/><br/></CardContent><CardActions/></Card>
        )
    }
}

signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});



export default connect(mapStateToProps, { signupUser })(withStyles(styles)(signup));
