import React, { Component, Fragment } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'; 
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';

//Redux
import { connect } from 'react-redux';
import { addNewResponse } from '../../redux/actions/dataActions';

//MUI Stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ReplyIcon from '@material-ui/icons/Reply';
import TextField from '@material-ui/core/TextField';


const styles = {

};

export class ReplyButton extends Component {
    state = {
        title: '',
        content: '',
        open: false
    };
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
    addNewResponse = () => {
        const responseDetails = {
            title: this.state.title,
            content: this.state.content
        }
        this.props.addNewResponse(this.props.postId, responseDetails);
        this.handleClose();
    }
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Reply" onClick={this.handleOpen}>
                    <ReplyIcon color="primary"/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Add new reply
                    </DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name="title"
                                type="text"
                                label="Title"
                                placeholder="Title of the reply"
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
                                rows="5"
                                placeholder="Content of the reply"
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
                        <Button onClick={this.addNewResponse} color="primary">
                            Reply
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

ReplyButton.propTypes = {
    addNewResponse: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
}

export default connect(null, { addNewResponse })(withStyles(styles)(ReplyButton))