import React, { Component } from "react";
import uuid from "uuid/v4";
import { Axios, buildings } from "../Constants";
import AddWork from "../Components/AddWork/AddWork";
import Overlay from "../Components/Overlay/Overlay";

export default class extends Component {
  constructor() {
    super();
    this.state = {
      client: {},
      isUpdating: false,
      addWork: { title: "", date: "" },
      deleteWork: { idx: "", title: "", date: "" }
    };
  }

  componentDidMount = () => this.reinitializeData();

  reinitializeData = () => {
    const client = localStorage.getItem("client");
    this.setState({ client: JSON.parse(client) });
  };

  handleChange = (e, key1, key2, key3) => {
    const { value } = e.target,
      state = this.state;

    if (key2 === "mobile") if (value.length >= 11) return;

    if (key3) state[key1][key2][key3] = value;
    else state[key1][key2] = value;

    this.setState(state);
  };

  handleSubmit = e => {
    if (e) e.preventDefault();

    const { client } = this.state;
    const { mobile } = client;

    if (mobile.toString().length > 10) {
      alert("Please enter corrent Mobile No.: ");
      return 0;
    }

    this.setState({ isUpdating: true });

    Axios.put(`/client/`, client)
      .then(({ data }) => {
        const client = data;
        localStorage.setItem("client", JSON.stringify(client));
        this.setState({ isUpdating: false, client }, this.reinitializeData);
      })
      .catch(err => alert("An Error Occurred!") || console.log(err));
  };

  deleteClient = () => {
    this.setState({ isUpdating: true });
    Axios.delete(`/client/${this.state.client._id}`)
      .then(_ => {
        localStorage.removeItem("client");
        this.props.history.replace("/");
      })
      .catch(err => alert("An error occurred") || console.log(err));
  };

  submitWork = () => {
    const { addWork, client } = this.state;
    const { title, date } = addWork;

    if (!title || !date) {
      alert("All Work feilds are required!");
      return 0;
    }

    client.work.push({ title, date });

    this.setState(
      { client, addWork: { title: "", date: "" } },
      this.handleSubmit
    );
  };

  showDeleteModal = idx => {
    this.setState({ deleteWork: { ...this.state.client.work[idx], idx: idx } });
    window.$("#deleteWorkModal").modal("show");
  };

  deleteWork = () => {
    window.$("#deleteWorkModal").modal("hide");
    let { client, deleteWork } = this.state;
    client.work.splice(deleteWork.idx, 1);
    this.setState({ client, deleteWork: "" }, this.handleSubmit);
  };

  render = () => {
    const { client, addWork, isUpdating, deleteWork } = this.state;
    if (!client.name) return <div>Loading...</div>;

    const { name, mobile, date, work, address } = client;
    const { wing, room, building, area } = address;

    return (
      <div className="row container-fluid mt-5">
        {isUpdating && <Overlay />}

        <div className="col-12 col-md-6 col-lg-4 mx-auto">
          <form className="card px-1 py-3" onSubmit={this.handleSubmit}>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label>Name: </label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={e => this.handleChange(e, "client", "name")}
                      placeholder="Name"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label>Mobile: </label>
                    <input
                      type="number"
                      className="form-control"
                      value={mobile}
                      onChange={e => this.handleChange(e, "client", "mobile")}
                      placeholder="Mobile"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label>Date: </label>
                    <input
                      type="text"
                      className="form-control"
                      value={date}
                      onChange={e => this.handleChange(e, "client", "date")}
                      placeholder="Date"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label>Wing: </label>
                    <input
                      type="text"
                      className="form-control"
                      value={wing}
                      onChange={e =>
                        this.handleChange(e, "client", "address", "wing")
                      }
                      placeholder="Wing"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label>Room: </label>
                    <input
                      type="text"
                      className="form-control"
                      value={room}
                      onChange={e =>
                        this.handleChange(e, "client", "address", "room")
                      }
                      placeholder="Room"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label>Building: </label>
                    <input
                      type="text"
                      className="form-control"
                      value={building}
                      onChange={e =>
                        this.handleChange(e, "client", "address", "building")
                      }
                      list="buildingList"
                      placeholder="Building"
                    />
                    <datalist id="buildingList">
                      {buildings.map(item => (
                        <option value={item} key={uuid()} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label>Area: </label>
                    <input
                      type="text"
                      className="form-control"
                      value={area}
                      onChange={e =>
                        this.handleChange(e, "client", "address", "area")
                      }
                      placeholder="Area"
                    />
                  </div>
                </div>
                <div className="col-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block d-flex justify-content-center align-items-center mb-3 px-4"
                  >
                    <span className="ml-2">Update</span>
                  </button>
                  <hr />
                </div>
                <div className="col-12 text-center">
                  <input
                    type="button"
                    className="btn btn-danger btn-block px-2"
                    value={`Delete ${name}`}
                    onClick={this.deleteClient}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="col-12 col-md-6 col-lg-6 mx-auto">
          <div className="mb-3 mt-3 mt-md-0">
            <AddWork
              addWork={addWork}
              handleChange={this.handleChange}
              submitWork={this.submitWork}
            />
          </div>
          <hr />

          {work && (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Work</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {work.map(({ title, date }, idx) => (
                  <tr
                    key={uuid()}
                    onClick={this.showDeleteModal.bind(this, idx)}
                  >
                    <td>{title}</td>
                    <td>
                      <div className="row">
                        <div className="col-10">{date}</div>
                        <div className="col-2">
                          <i className="fal fa-trash-alt text-danger"></i>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div
          className="modal fade"
          id="deleteWorkModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger" id="exampleModalLabel">
                  {`Delete ${name}'s Work?`}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <span className="mr-5">{deleteWork.title}</span>
                {deleteWork.date}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  No
                </button>
                <button
                  onClick={this.deleteWork}
                  type="button"
                  className="btn btn-danger"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
