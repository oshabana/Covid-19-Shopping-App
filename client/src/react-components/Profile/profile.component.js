import React, { Component } from "react";
import "./profile.css";
import SigninError from "../Errors/SigninError";
import {
    createFamily,
    createTribe,
    joinFamily,
    declineFamily,
    joinTribe,
    declineTribe,
    resetpass
} from "../../actions/profile";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newFamilyName: "",
            newTribeName: "",
            pendingFamily: "",
            pendingTribeID: [],
            pendingTribes: [],
            joinTribe: undefined,
            user: undefined,
            input: {
                email: "",
                password: "",
            },
            current: {
                email: this.props.user.email,
                password: "123456",
            },
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleJoinFamily = this.handleJoinFamily.bind(this);
        this.handleDeclineFamily = this.handleDeclineFamily.bind(this);
        this.handleJoinTribe = this.handleJoinTribe.bind(this);
        this.handleDeclineTribe = this.handleDeclineTribe.bind(this);
        this.handleJoinTribeChange = this.handleJoinTribeChange.bind(this);
        this.handleSubmitNewFamily = this.handleSubmitNewFamily.bind(this);
        this.handleChangeNewFamily = this.handleChangeNewFamily.bind(this);
        this.handleSubmitNewTribe = this.handleSubmitNewTribe.bind(this);
        this.handleChangeNewTribe = this.handleChangeNewTribe.bind(this);
        this.isValidUser = this.isValidUser.bind(this);
        // this.handleChangepass = this.handleChangepass.bind(this);
    }

    async componentDidMount() {
        try {
            const response = await fetch("/users", {
                method: "GET",
                crossDomain: true,
                credentials: "include",
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json",
                },
                referrerPolicy: "no-referrer",
            });
            if (response.status < 400) {
                const user = await response.json();
                if (!user) {
                    return;
                }
                this.setState({ user });
            }
        } catch (err) {
            console.log(err);
        }

        try {
            if (!this.state.user) {
                return;
            }
            if (!this.state.user.pending) {
            } else {
                const fid = this.state.user.pending;
                const url = `/family/${fid}`;
                const request = new Request(url, {
                    method: "GET",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                    },
                });
                const response = await fetch(request, {});
                const json = await response.json();
                const name = await json.familyName;

                this.setState({ pendingFamily: name });
            }

            if (!this.state.user.familyID) {
                return;
            } else {
                const fid = this.state.user.familyID;
                const url = `/family/${fid}`;
                const request = new Request(url, {
                    method: "GET",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                    },
                });
                const response = await fetch(request, {});
                const json = await response.json();
                const tribes = await json.pending;

                this.setState({ pendingTribeID: tribes });
            }

            if (this.state.pendingTribeID.length > 0) {
                const pendingTribeNames = [];
                this.state.pendingTribeID.map(async (tribeID) => {
                    const url = `/tribe/${tribeID}`;
                    const request = new Request(url, {
                        method: "GET",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json",
                        },
                    });
                    const response = await fetch(request, {});
                    const json = await response.json();
                    const tribeName = await json.tribeName;

                    pendingTribeNames.push(await tribeName);
                    this.setState({ pendingTribes: pendingTribeNames });
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        resetpass(this.state.user.id,this.state.input.email,this.state.input.password);
        this.setState({current:{email:this.state.input.email , password: "123456"}})
        this.setState({input: { email: "", password: "" }})
        
       

    }

    handleChange(e) {
        e.preventDefault();
        const newb = { ...this.state.input, [e.target.name]: e.target.value };
        this.setState({ input: newb });
    }

    handleJoinFamily(e) {
        e.preventDefault();
        joinFamily(this.state.user.pending);
        this.setState({ pendingFamily: "" });
        this.props.getUser();
    }

    handleDeclineFamily(e) {
        e.preventDefault();
        declineFamily(this.state.user.pending);
        this.setState({ pendingFamily: "" });
        this.props.getUser();
    }

    handleJoinTribe(e) {
        e.preventDefault();
        const index = this.state.pendingTribes.indexOf(this.state.joinTribe);
        const tribe = this.state.pendingTribeID[index];
        joinTribe(tribe);
        this.setState({ joinTribe: undefined });
        this.props.getUser();
    }

    handleDeclineTribe(e) {
        e.preventDefault();
        const index = this.state.pendingTribes.indexOf(this.state.joinTribe);
        const tribe = this.state.pendingTribeID[index];
        declineTribe(tribe);
        this.setState({ joinTribe: undefined });
        this.props.getUser();
    }

    handleJoinTribeChange(e) {
        e.preventDefault();
        this.setState({ joinTribe: e.target.value });
    }

    handleChangeNewFamily(e) {
        e.preventDefault();
        const fName = e.target.value;
        this.setState({ newFamilyName: fName });
    }

    handleSubmitNewFamily(e) {
        e.preventDefault();
        createFamily(this.state.newFamilyName);
        this.setState({ newFamilyName: "" });
        this.props.getUser();
    }

    handleChangeNewTribe(e) {
        e.preventDefault();
        const tName = e.target.value;
        this.setState({ newTribeName: tName });
    }

    handleSubmitNewTribe(e) {
        e.preventDefault();
        createTribe(this.state.newTribeName);
        this.setState({ newTribeName: "" });
        this.props.getUser();
    }
    isValidUser(content) {
        if (this.props.user === null) return <SigninError />;
        return content;
    }
    render() {
        const userFamily = this.state.user ? this.state.user.familyID : null;
        const familyName = this.state.user ? this.state.pendingFamily : null;
        const isFamilyAdmin = this.state.user
            ? this.state.user.familyAdmin
            : false;

        const newForm = userFamily ? (
            isFamilyAdmin ? (
                <div className=" stylechanges col-md  ">
                    <div className="list">
                        <li>
                            {" "}
                            <strong>Create New Tribe:</strong>
                        </li>
                    </div>
                    <form onSubmit={this.handleSubmitNewTribe}>
                        <input
                            type="name"
                            name="name"
                            placeholder="Tribe Name"
                            value={this.state.newTribeName}
                            onChange={this.handleChangeNewTribe}
                            required
                        />
                        <br />
                        <button
                            className="buttonsubmit btn btn-primary btn-add"
                            type="submit"
                        >
                            Add Tribe
                        </button>
                    </form>
                </div>
            ) : (
                <div></div>
            )
        ) : (
            <div className=" stylechanges col-md  ">
                <div className="list">
                    <li>
                        {" "}
                        <strong>Create New Family:</strong>
                    </li>
                </div>
                <form onSubmit={this.handleSubmitNewFamily}>
                    <input
                        type="name"
                        name="name"
                        placeholder="Family Name"
                        value={this.state.newFamilyName}
                        onChange={this.handleChangeNewFamily}
                        required
                    />
                    <br />
                    <button
                        className="buttonsubmit btn btn-primary btn-add"
                        type="submit"
                    >
                        Add Family
                    </button>
                </form>
            </div>
        );

        const joinFamilyForm = familyName ? (
            <div>
                <div className="list">
                    <li>
                        <strong>Join Family: {familyName}</strong>
                    </li>
                </div>
                <form onSubmit={this.handleJoinFamily}>
                    <br />
                    <button
                        className="buttonsubmit btn btn-primary btn-add"
                        type="submit"
                    >
                        Join Family
                    </button>
                </form>
                <form onSubmit={this.handleDeclineFamily}>
                    <br />
                    <button
                        className="buttonsubmit btn btn-primary btn-add"
                        type="submit"
                    >
                        Decline
                    </button>
                </form>
            </div>
        ) : (
            <div></div>
        );

        const joinTribeForm =
            isFamilyAdmin && this.state.pendingTribes.length > 0 ? (
                <div>
                    <div className="list">
                        <li>
                            <strong>Join Tribe:</strong>
                        </li>
                    </div>
                    <form>
                        <label>
                            Choose a tribe:
                            <input
                                list="tribes"
                                onChange={this.handleJoinTribeChange}
                            />
                        </label>
                        <datalist id="tribes">
                            {this.state.pendingTribes.map((tribe) => (
                                <option value={tribe} />
                            ))}
                        </datalist>
                        <br />
                        <button
                            className="btn btn-primary btn-add"
                            type="button"
                            onClick={this.handleJoinTribe}
                        >
                            Join Tribe
                        </button>
                        <button
                            className="btn btn-primary btn-add"
                            type="button"
                            onClick={this.handleDeclineTribe}
                        >
                            Decline Tribe
                        </button>
                    </form>
                </div>
            ) : (
                <div></div>
            );
        const profileHtml = (
            <div>
                <div className="row">
                    <div className="stylechanges col-lg ">
                        <div className="list">
                            <li>
                                {" "}
                                <strong>Email:</strong>{" "}
                                {this.state.current ? this.state.current.email:  " "}
                            </li>
                            <li>
                                <strong>Password:</strong>{" "}
                                {"*".repeat(this.state.current.password.length)}
                            </li>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <input
                                type="email"
                                name="email"
                                placeholder="New Email"
                                value={this.state.input.email}
                                onChange={this.handleChange}
                                required
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="New Password"
                                value={this.state.input.password}
                                onChange={this.handleChange}
                                required
                            />
                            <br />
                            <button
                                className="buttonsubmit btn btn-primary btn-add"
                                type="submit"
                            >
                                Change Password and Email
                            </button>
                        </form>
                    </div>
                    {newForm}
                </div>

                <div className="stylechanges col-lg">
                    {joinFamilyForm}
                    {joinTribeForm}
                </div>
            </div>
        );
        return (
            <div className="box container-lg">
                {this.isValidUser(profileHtml)}
            </div>
        );
    }
}
