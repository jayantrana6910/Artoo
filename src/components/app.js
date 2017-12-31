// Libraries
import React, { Component } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/lib/Table';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Button from 'react-bootstrap/lib/Button';
import orderBy from 'lodash/orderBy';

class App extends Component {

    state = {
        ids: [],                            // Contains Hacker News ID's
        data: [{                            // Data belonging to IDs
            id: 0,
            by: '',
            score: 0,
            time: '',
            type: '',
            title: '',
            url: ''
        }],
        copyData: [{}],                     // Copy of state.data
        flag: 0
    }

    getNewStoriesIds (url, stateName) {    // Saves all the newstories in state.ids
        axios.get(url).then(({ data }) => {
            if(this.state.data[0].id == 0){
                this.state.data.splice(0, 1);
            }
            for (var i=0; i<500; i++) {   // Retreives all the data corresponding to the state.ids
                var id = data[i];
                var url = 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json';
                this.getActualData(url, 'data');
            }
        })
    }

    getActualData (url, stateName) {    // Stores all the data into state.data
        axios.get(url).then(({ data }) => {
            var tempdata = this.state.data.slice();
            var temptime = new Date(data.time * 1000);
            tempdata.push({id: data.id, by: data.by, score: data.score, time: temptime, type: data.type, title: data.title, url: data.url})
            var temp = orderBy(tempdata, 'time', 'desc');
            this.setState({ [stateName]: temp });
        })
    }

    // Filters

    getOriginal() {         // On clicking Original Button shows all data.
        this.setState({ data: this.state.copyData });
    }

    withoutUrl() {          // Shows data with no url provided
        if (this.state.flag == 0) {
            this.setState({ copyData: this.state.data });
            this.setState({ flag: 1 });
        }
        var tempData = this.state.data.slice();
        var arrayData = this.state.data.slice();
        arrayData.splice(0, 500);
        console.log(arrayData);
        for ( var i=0; i<tempData.length; i++) {
            if ( tempData[i].url == null) {
                arrayData.push({id: tempData[i].id, by: tempData[i].by, score: tempData[i].score, time: tempData[i].time, type: tempData[i].type, title: tempData[i].title, url: tempData[i].url})
            }
        }
        this.setState({ data: arrayData });
    }

    scoreMoreThan25() {             // Shows data with Score more than 25
        if (this.state.flag == 0) {
            this.setState({ copyData: this.state.data });
            this.setState({ flag: 1 });
        }
        var tempData = this.state.data.slice();
        var arrayData = this.state.data.slice();
        arrayData.splice(0, 500);
        for ( var i=0; i<tempData.length; i++) {
            if ( tempData[i].score >= 25) {
                arrayData.push({id: tempData[i].id, by: tempData[i].by, score: tempData[i].score, time: tempData[i].time, type: tempData[i].type, title: tempData[i].title, url: tempData[i].url})
            }
        }
        this.setState({ data: arrayData });
    }

    // Sorting

    sortByScore() {             // Sorts By Score
        var sortData = this.state.data.slice();
        var byScore = orderBy(sortData, 'score', 'desc');
        this.setState({ data: byScore });
    }

    sortByTime() {              // Sorts By Time
        var sortData = this.state.data.slice();
        var byTime = orderBy(sortData, 'time', 'desc');
        this.setState({ data: byTime });
    }

    componentDidMount() {                    // Retreives all the newstories ids
        this.getNewStoriesIds('https://hacker-news.firebaseio.com/v0/newstories.json', 'ids');
    }

    render() {
        const {ids, data} = this.state;

        return (
            <div className="App container">
                <div className="col-lg-6">
                    <h3>Sort</h3>
                    <Button onClick={(event) => this.sortByScore()} bsStyle='info'>By Score</Button>
                    <Button onClick={(event) => this.sortByTime()} bsStyle='info'>By Time</Button>
                </div>
                <div className="col-lg-6">
                    <h3>Filters</h3>
                    <Button onClick={(event) => this.withoutUrl()} bsStyle='info'>No URL</Button>
                    <Button onClick={(event) => this.scoreMoreThan25()} bsStyle='info'>Score more than 25</Button>
                    <Button onClick={(event) => this.getOriginal()} bsStyle='info'>Original</Button>
                </div>
                <div>
                    <Table striped bordered condensed hover     className='blackColor'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>id</th>
                                <th>Score</th>
                                <th>Time</th>
                                <th>Type</th>
                                <th>Title</th>
                                <th>Url</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={row.id}>
                                    <td>{index}</td>
                                    <td>{row.id}</td>
                                    <td>{row.score}</td>
                                    <td>{row.time.toString()}</td>
                                    <td>{row.type}</td>
                                    <td>{row.title}</td>
                                    <td><a href={row.url}>{row.url}</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }

}

export default App;
