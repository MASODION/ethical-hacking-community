import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';


//Redux
import { connect } from 'react-redux';
import { addNewPost } from '../../redux/actions/dataActions';

//MUI stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';


//icons
import AddIcon from '@material-ui/icons/Add';


const styles = {
    button: {
        color: 'inherit'
    }
};

export class AddNewPost extends Component {
    state = {
        title: '',
        content: '',
        prize: 0,
        tags: '',
        website: '',
        errors: {},
        open: false
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
          this.setState({ errors: nextProps.UI.errors });
        }
        else {
            this.handleClose();
            this.setState({ 
                title: '',
                content: '',
                prize: 0,
                tags: '',
                website: '',
                errors: {},
                open: false
            });
        }
    }
    handleOpen = () => {
        this.setState({
            open: true
        });
    }
    handleClose = () => {
        this.setState({
            open: false
        });
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    addNewPost = () => {
        const postDetails = {
            title: this.state.title,
            content: this.state.content,
            prize: this.state.prize,
            tags: this.state.tags,
            website: this.state.website,
        }
        this.props.addNewPost(postDetails);
        //if(!this.props.UI.loading) this.handleClose();
    }
    render() {
        const { classes, } = this.props;
        const { errors } = this.state;
        return (
            <Fragment>
                <MyButton tip="Add new post" btnClassName={classes.button} onClick={this.handleOpen}>
                    <AddIcon color="inherit"/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Add new post
                    </DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name="title"
                                type="text"
                                label="Title"
                                placeholder="Title of the post"
                                className={classes.texfield}
                                value={this.state.title}
                                onChange={this.handleChange}
                                helperText={errors.title}
                                error={errors.title ? true : false}
                                fullWidth>
                            </TextField>
                            <TextField
                                name="prize"
                                type="text"
                                label="Prize"
                                placeholder="Prize of the post"
                                className={classes.texfield}
                                value={this.state.prize}
                                onChange={this.handleChange}
                                helperText={errors.prize}
                                error={errors.prize ? true : false}
                                fullWidth>
                            </TextField>
                            <TextField
                                name="tags"
                                type="text"
                                label="Tags"
                                placeholder="Tags of the post"
                                className={classes.texfield}
                                value={this.state.tags}
                                onChange={this.handleChange}
                                helperText={errors.tags}
                                error={errors.tags ? true : false}
                                fullWidth>
                            </TextField>
                            <TextField
                                name="website"
                                type="text"
                                label="Website"
                                placeholder="Website (github recomanded)"
                                className={classes.texfield}
                                value={this.state.website}
                                onChange={this.handleChange}
                                helperText={errors.website}
                                error={errors.website ? true : false}
                                fullWidth>
                            </TextField>
                            <TextField
                                name="content"
                                type="text"
                                label="Content"
                                multiline
                                rows="5"
                                placeholder="Content of the post"
                                className={classes.texfield}
                                value={this.state.content}
                                onChange={this.handleChange}
                                helperText={errors.content}
                                error={errors.content ? true : false}
                                fullWidth>
                            </TextField>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addNewPost} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

AddNewPost.propTypes = {
    addNewPost: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    UI: state.UI
})

export default connect(mapStateToProps, { addNewPost })(withStyles(styles)(AddNewPost))
