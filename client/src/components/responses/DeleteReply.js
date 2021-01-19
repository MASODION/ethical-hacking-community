import React, { Component, Fragment } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'; 
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';

//Redux
import { connect } from 'react-redux';
import { deleteResponse } from '../../redux/actions/dataActions';

//MUI Stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Delete from '@material-ui/icons/Delete';

const styles = {

};

export class DeleteReply extends Component {
    state = {
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
    deleteResponse = () => {
        this.props.deleteResponse(this.props.postId, this.props.responseId);
        this.setState({
            open: false
        });
    }
    render() {
        return (
            <Fragment>
                <MyButton tip="Delete response" onClick={this.handleOpen}>
                    <Delete color="secondary"/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Are you sure you want to delete this response?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deleteResponse} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeleteReply.propTypes = {
    deleteResponse: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    responseId: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired
}

export default connect(null, { deleteResponse })(withStyles(styles)(DeleteReply))
