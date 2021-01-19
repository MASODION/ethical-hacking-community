import React, { Component } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Link from 'react-router-dom/Link';

//mui stuff
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

//icons
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';

const styles = {
    firstplace: {
        color: 'gold'
    },
    secondplace: {
        color: 'silver'
    },
    lastplace: {
        color: 'RosyBrown'
    }
}

export class TopList extends Component {
    render() {
        const { classes } = this.props;
        const {
            result
        } = this.props;
        return (
            <ListItem button>
            <ListItemText primary={(
                <div>
                <Typography component={Link} to={`/users/${result.userNickName}`}>@{result.userNickName}</Typography>
                <Typography>({result.responsesCount} responses, {result.rewardedCount} rewarded, {result.coinsRewarded} coins.)</Typography>
                </div>
            )} />
        </ListItem>
        )
    }
}

TopList.propTypes = {
    classes: PropTypes.object.isRequired,
    result: PropTypes.object.isRequired
}

export default withStyles(styles)(TopList)
