import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';

class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            winner: '',
            winningDigits: '',
        };
        this.generateLottery = this.generateLottery.bind(this);
    }

    componentDidMount() {
        this.props.getUsers();
    }

    handleDeleteUser(id) {
        return (e) => this.props.deleteUser(id);
    }

    generateLottery(size, lowest, highest) {
        const numbers = [];
        for(let i = 0; i < size; i++) {
            let add = true;
            let randomNumber = Math.floor(Math.random() * highest) + 1;
            for(let y = 0; y < highest; y++) {
                if(numbers[y] == randomNumber) {
                    add = false;
                }
            }
            if(add) {
                numbers.push(randomNumber);
            } else {
                i--;
            }
        }
        let highestNumber = 0;
        for(let m = 0; m < numbers.length; m++) {
            for(let n = m + 1; n < numbers.length; n++) {
                if(numbers[n] < numbers[m]) {
                    highestNumber = numbers[m];
                    numbers[m] = numbers[n];
                    numbers[n] = highestNumber;
                }
            }
        }
        const { users } = this.props;
        const { winner } = this.state;
        if(users.items && users.items.length > 0) {
            let user = users.items[Math.floor(Math.random() * users.items.length)];
            const winnerDetails = {
                winner: user.firstName + " " + user.lastName,
                winningDigits: numbers.join(" - ")
            };
            this.setState(winnerDetails);
            const userDetails = {
                email: user.email,
                data: {
                    digits: numbers.join(" - "),
                    user: user.firstName + " " + user.lastName
                }
            };
            this.props.sendEmail(userDetails);
        }
    }

    render() {
        const { user, users } = this.props;
        const { winner, winningDigits } = this.state;
        return (
            <div className="col-md-12">
                <h1>Secret Friend Lottery!</h1>
                {users.loading && <em>Loading users...</em>}
                {users.items && users.items.length == 0 ?
                    <span className="text-danger">No registered users yet. Click <Link to="/register">here</Link> to register.
                    </span> : 
                    <div>
                    <h5>All registered users:</h5>
                    {users.items &&
                        <ul>
                            {users.items.map((user, index) =>
                                <li key={user.id}>
                                    {user.firstName + ' ' + user.lastName}
                                </li>
                            )}
                        </ul>
                    }
                    <button type="button" className="btn btn-primary btn-lg btn-block mb-4" onClick={() => this.generateLottery(6, 1, 49)}>Draw the winner!</button>

                    <p>
                        Would you like to add another friend? Click <Link to="/register">here</Link> to register. 
                    </p>
                    {
                        winner && winningDigits ? 
                            <div className="card text-center">
                                <div className="card-body">
                                    <h3 className="card-title">The winner is ...</h3>
                                    <h1 className="card-text">{ winner }</h1>
                                    <h3 className="card-title">Winning digits are ...</h3>
                                    <h2 className="card-text">{ winningDigits }</h2>
                                </div>
                            </div>
                        :
                        <div></div>
                    }
                    </div>
                }
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete,
    sendEmail: userActions.sendEmail
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };