import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';


//redux
import { connect } from 'react-redux';
import { addNewReward } from '../../redux/actions/dataActions';


//MUI stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';


//icons
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

const styles = {
    button: {
        color: 'primary'
    }
}

export class RewardResponse extends Component {
    state = {
        coins: 0,
        open: false,
        errors: {}
    }
    componentDidMount() {
        if(this.props.postPrize > 0) {
            this.setState({
                coins: this.props.postPrize
            })
        }
    }
    handleOpen = () => {
        this.setState({
            open: true
        });
    }
    handleClose = () => {
        this.setState({
            coins: 0,
            errors: {},
            open: false
        });
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
        if(this.state.coins <= 0) {
            this.setState({
                errors: {
                    coins: 'Value must be greater than 0'
                }
            });
        }
        else if(this.state.coins < this.props.postPrize && this.props.postPrize > 0) {
            this.setState({
                errors: {
                    coins: 'Value must be greater than post prize'
                }
            });
        }
        else {
            this.setState({
                errors: {}
            });
        }
    };
    addNewReward = () => {
        const rewardDetails = {
            coins: parseInt(this.state.coins, 10),
            responseId: this.props.responseId,
            root: this.props.root,
            creator: this.props.creator
        }
        this.props.addNewReward(rewardDetails);
        this.handleClose();
    }
    render() {
        const {
            classes
        } = this.props;
        return (
            <Fragment>
                <MyButton tip="Reward response" btnClassName={classes.button} onClick={this.handleOpen}>
                    <LoyaltyIcon color="primary"/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Add new reward
                    </DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name="coins"
                                type="number"
                                label="Coins"
                                placeholder="Enter the coins amount"
                                className={classes.texfield}
                                value={this.state.coins}
                                onChange={this.handleChange}
                                helperText={this.state.errors.coins}
                                error={this.state.errors.coins ? true : false}
                                fullWidth>
                            </TextField>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addNewReward} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

RewardResponse.propTypes = {
    classes: PropTypes.object.isRequired,
    root: PropTypes.string.isRequired,
    responseId: PropTypes.string.isRequired,
    addNewReward: PropTypes.func.isRequired,
    postPrize: PropTypes.number.isRequired,
    creator: PropTypes.string.isRequired
}

export default connect(null, {addNewReward})(withStyles(styles)(RewardResponse))
