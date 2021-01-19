import React, { Component } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Link from 'react-router-dom/Link';
import TopList1 from '../components/users/TopList1.js';
import TopList2 from '../components/users/TopList2.js';
import TopList3 from '../components/users/TopList3.js';
import TopList from '../components/users/TopList.js';

//redux
import { connect } from 'react-redux';
import { getAllUsers } from '../redux/actions/dataActions';


//mui stuff
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';


//icons
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';



const styles = {
    root: {
        flexGrow: 1,
        backgroundColor: 'rgb(165, 161, 161)',
      },
    tabs: {
        position: 'center',
        textAlign: 'center'
    },
    top: {
        width: '100%',
    },
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


export class users extends Component {
    state = {
        value: 0
    }
    componentDidMount() {
        this.props.getAllUsers();
    }
    a11yProps = (index) => {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    handleChange = (event, newValue) => {
        this.setState({
            value: newValue
        });
    };
    calculateThisMonth = (usersvector, i) => {
        var d = new Date();
        var n = d.getMonth() - i;
        let response = [];
        usersvector.forEach((user) => {
            let rewardedCount = 0;
            let responsesCount = 0;
            let coinsRewarded = 0;
            let stats = 0.0;
            if(user.responses && user.responses.length >= 0) {
                user.responses.forEach((response) => {
                    if(response.reward > 0 && parseInt(response.createdAt.substring(5,7)) === n) {
                        rewardedCount = rewardedCount + 1;
                        coinsRewarded = coinsRewarded + response.reward;
                        responsesCount = responsesCount + 1;
                    }
                    else if(parseInt(response.createdAt.substring(5,7)) === n) responsesCount = responsesCount + 1;
                })
            }
            stats = ((40*coinsRewarded) + (40*rewardedCount) + (20*responsesCount)) / 100;
            response.push({
                ...user,
                rewardedCount: rewardedCount,
                coinsRewarded: coinsRewarded,
                responsesCount: responsesCount,
                stats: stats
            });
        });
        response.sort(function(a, b){return b.stats-a.stats});
        if(response.length > 10) {
            return response.slice(0, 11);
        }
        else return response;
    }
    render() {
        const { 
            classes,
        } = this.props;
        const { loading, users } = this.props.data;
        let count = 0;
        const lastMonthMarkup = !loading && this.props.data && users && users.length >= 0 ? (
            this.calculateThisMonth(users, 0).map((result) => {
                if(count === 0) {
                    count = count + 1;
                    return (<TopList1 key={result.userNickName} count={count} result={result}/>);
                } else if (count === 1) {
                    count = count + 1;
                    return (<TopList2 key={result.userNickName} count={count} result={result}/>);
                } else if (count === 2) {
                    count = count + 1;
                    return (<TopList3 key={result.userNickName} count={count} result={result}/>)
                } else {
                    count = count + 1;
                    return (<TopList key={result.userNickName} count={count} result={result}/>);
                }
            })
        ) : (<p>loading</p>);
        count = 0;
        const twoMonthsAgo = !loading && this.props.data && users && users.length >= 0 ? (
            this.calculateThisMonth(users, 1).map((result) => {
                if(count === 0) {
                    count = count + 1;
                    return (<TopList1 key={result.userNickName} count={count} result={result}/>);
                } else if (count === 1) {
                    count = count + 1;
                    return (<TopList2 key={result.userNickName} count={count} result={result}/>);
                } else if (count === 2) {
                    count = count + 1;
                    return (<TopList3 key={result.userNickName} count={count} result={result}/>)
                } else {
                    count = count + 1;
                    return (<TopList key={result.userNickName} count={count} result={result}/>);
                }
            })
        ) : (<p>loading</p>);
        count = 0;
        const threeMonthsAgo = !loading && this.props.data && users && users.length >= 0 ? (
            this.calculateThisMonth(users, 2).map((result) => {
                if(count === 0) {
                    count = count + 1;
                    return (<TopList1 key={result.userNickName} count={count} result={result}/>);
                } else if (count === 1) {
                    count = count + 1;
                    return (<TopList2 key={result.userNickName} count={count} result={result}/>);
                } else if (count === 2) {
                    count = count + 1;
                    return (<TopList3 key={result.userNickName} count={count} result={result}/>)
                } else {
                    count = count + 1;
                    return (<TopList key={result.userNickName} count={count} result={result}/>);
                }
            })
        ) : (<p>loading</p>);
        return (
            <div className={classes.root}>
        <AppBar position="static">
            <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example" className={classes.tabs}>
                <Tab label="Last month" {...this.a11yProps(0)} />
                <Tab label="2 months ago" {...this.a11yProps(1)} />
                <Tab label="3 months ago" {...this.a11yProps(2)} />
            </Tabs>
        </AppBar>


        <div
            role="tabpanel"
            hidden={this.state.value !== 0}
            id={`simple-tabpanel-0`}
            aria-labelledby={`simple-tab-0`}
        >
            <Paper>
                <div className={classes.top}>
                    <List component="nav" aria-label="lastmonth">
                        {lastMonthMarkup}
                    </List>
                </div>
            </Paper>
        </div>


        <div
            role="tabpanel"
            hidden={this.state.value !== 1}
            id={`simple-tabpanel-1`}
            aria-labelledby={`simple-tab-1`}
        >
            <Paper>
                <div className={classes.top}>
                    <List component="nav" aria-label="2months">
                        {twoMonthsAgo}
                    </List>
                </div>
            </Paper>
        </div>


        <div
            role="tabpanel"
            hidden={this.state.value !== 2}
            id={`simple-tabpanel-2`}
            aria-labelledby={`simple-tab-2`}
        >
            <Paper>
                <div className={classes.top}>
                    <List component="nav" aria-label="top3">
                        {threeMonthsAgo}
                    </List>
                </div>
            </Paper>
        </div>
    </div>
        )
    }
}

users.propTypes = {
    classes: PropTypes.object.isRequired,
    getAllUsers: PropTypes.func.isRequired,
    children: PropTypes.node,
    data: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    data: state.data
})

export default connect(mapStateToProps, { getAllUsers })(withStyles(styles)(users))
