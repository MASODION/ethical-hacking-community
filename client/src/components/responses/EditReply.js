import React, { Component, Fragment } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'; 
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';

//Redux
import { connect } from 'react-redux';
import { editResponse } from '../../redux/actions/dataActions';

//MUI Stuff
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


//icons
import EditIcon from '@material-ui/icons/Edit';

const styles = {

};

export class EditReply extends Component {
    state = {
        title: '',
        content: '',
        open: false
    };
    mapResponseDataToState = (data) => {
        this.setState({
            title: data.title,
            content: data.content
        });
    }
    componentDidMount() {
        if(this.props.responseData) this.mapResponseDataToState(this.props.responseData);
    }
    handleOpen = () => {
        this.setState({ open: true });
        this.mapResponseDataToState(this.props.responseData);
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
        const responseData = {
            title: this.state.title,
            content: this.state.content
        }
        this.props.editResponse(this.props.postId, this.props.responseId, responseData);
        this.handleClose();
    }
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Edit response" onClick={this.handleOpen}>
                    <EditIcon color="primary"/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Edit your response
                    </DialogTitle>
                    <DialogContent>
                        <form>
                        <TextField
                                name="title"
                                type="text"
                                label="Title"
                                multiline
                                rows="1"
                                placeholder="Title of your post"
                                className={classes.texfield}
                                value={this.state.title}
                                onChange={this.handleChange}
                                fullWidth>
                            </TextField>
                            <TextField
                                name="content"
                                type="text"
                                label="Content"
                                multiline
                                rows="3"
                                placeholder="Content of your post"
                                className={classes.texfield}
                                value={this.state.content}
                                onChange={this.handleChange}
                                fullWidth>
                            </TextField>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="secondary">
                            Edit
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditReply.propTypes = {
    editResponse: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    responseId: PropTypes.string.isRequired,
    responseData: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
}

export default connect(null, { editResponse })(withStyles(styles)(EditReply))
