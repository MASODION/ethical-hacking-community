import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';


//Redux
import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';


//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

//Icons
import EditIcon from '@material-ui/icons/Edit';

const styles = {

};

export class EditDetails extends Component {
    state = {
        bio: '',
        open: false
    }; 
    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : ''
        });
    };
    componentDidMount() {
        const { credentials } = this.props;
        this.mapUserDetailsToState(credentials);
    };
    handleOpen = () => {
        this.setState({ open: true });
        this.mapUserDetailsToState(this.props.credentials);
    };
    handleClose = () => {
        this.setState({ open: false });
    };
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    }
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Edit details" onClick={this.handleOpen}>
                    <EditIcon color="primary"/>
                </MyButton>
                <Dialog
                    open={this.state.open}
                    close={this.handleClose}
                    fullWidth
                    maxWidth="sm">
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name="bio"
                                type="text"
                                label="Bio"
                                multiline
                                rows="3"
                                placeholder="A short bio about yourself"
                                className={classes.texfield}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth>

                            </TextField>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
});

export default connect(mapStateToProps, { editUserDetails })(withStyles(styles)(EditDetails))
