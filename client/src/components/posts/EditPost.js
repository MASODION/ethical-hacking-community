import React, { Component, Fragment } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'; 
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';

//Redux
import { connect } from 'react-redux';
import { editPost } from '../../redux/actions/dataActions';

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



export class EditPost extends Component {
    state = {
        content: '',
        title: '',
        website: '',
        open: false
    };
    mapPostDetailsToState = (data) => {
        this.setState({
            content: data.content,
            title: data.title,
            website: data.website
        })
    };
    componentDidMount() {
        if(this.props.postData) this.mapPostDetailsToState(this.props.postData);
    };
    handleOpen = () => {
        this.setState({ open: true });
        this.mapPostDetailsToState(this.props.postData);
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
        const postDetails = {
            title: this.state.title,
            content: this.state.content,
            website: this.state.website
        };
        this.props.editPost(postDetails, this.props.postId);
        this.handleClose();
    }
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Edit post" onClick={this.handleOpen}>
                    <EditIcon color="primary"/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Edit your post
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
                                name="website"
                                type="text"
                                label="Website"
                                multiline
                                rows="1"
                                placeholder="website of your post"
                                className={classes.texfield}
                                value={this.state.website}
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


EditPost.propTypes = {
    editPost: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    postData: PropTypes.object.isRequired
}

export default connect(null, { editPost })(withStyles(styles)(EditPost))