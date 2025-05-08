import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const App = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationLegalEntity, setOrganizationLegalEntity] = useState("");
  const [chargePoints, setChargePoints] = useState<any[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const [newChargePointIdentity, setNewChargePointIdentity] = useState("");

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/organizations`);
      setOrganizations(response.data.data);
    } catch (error) {
      console.error("Error fetching organizations", error);
    }
  };

  const handleCreateOrganization = async () => {
    if (!organizationName) return; 
  
    try {
      const response = await axios.post(`${API_BASE}/organizations`, {
        name: organizationName,
        legalEntity: organizationLegalEntity,
      });
  
      if (response.data.data) {
        setOrganizations((prev) => [...prev, response.data.data]);
      }
  
      setOrganizationName("");
      setOrganizationLegalEntity("");
    } catch (error) {
      console.error("Error creating organization", error);
    }
  };

  const handleViewChargePoints = async (orgId: string) => {
    try {
      const response = await axios.get(`${API_BASE}/organizations/${orgId}`);
      setSelectedOrganization(response.data.data);
      setChargePoints(response.data.data.chargePoints || []);
    } catch (error) {
      console.error("Error fetching charge points", error);
    }
  };

  const handleAddChargePoint = async () => {
    if (!selectedOrganization) return;

    try {
      const response = await axios.post(`${API_BASE}/chargepoints`, {
        identity: newChargePointIdentity,
        organizationId: selectedOrganization.id,
      });

      setChargePoints([...chargePoints, response.data]);
      setNewChargePointIdentity("");
    } catch (error) {
      console.error("Error adding charge point", error);
    }
  };

  return (
    <div className="container p-5">
      <h1 className="display-4 mb-4">Organization Management</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card p-4 mb-4">
            <h2 className="h4">Create Organization</h2>
            <input
              className="form-control mt-2"
              type="text"
              placeholder="Name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
            <input
              className="form-control mt-2"
              type="text"
              placeholder="Legal Entity"
              value={organizationLegalEntity}
              onChange={(e) => setOrganizationLegalEntity(e.target.value)}
            />
            <button
              className="btn btn-primary mt-3"
              onClick={handleCreateOrganization}
              disabled={!organizationName}
            >
              Create
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="h4">Organizations</h2>
            <ul className="list-group">
              {organizations.map((org: any) => (
                <li key={org.id} className="list-group-item my-2">
                  <span className="fw-bold">{org.name || "N/A"}</span> {" "}
                  {org.legalEntity || "N/A"}
                  <button
                    className="btn btn-success btn-sm ms-4"
                    onClick={() => handleViewChargePoints(org.id)}
                  >
                    View ChargePoints
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {selectedOrganization && (
        <div className="card p-4 mt-4">
          <h2 className="h4">
            ChargePoints for {selectedOrganization.name}
          </h2>
          <ul className="list-group mb-4">
            {chargePoints.map((cp: any) => (
              <li key={cp.id} className="list-group-item">
                {cp.identity}
              </li>
            ))}
          </ul>

          <div>
            <h3 className="h5">Add ChargePoint</h3>
            <input
              className="form-control mt-2"
              type="text"
              placeholder="ChargePoint Identity"
              value={newChargePointIdentity}
              onChange={(e) => setNewChargePointIdentity(e.target.value)}
            />
            <button
              className="btn btn-primary mt-3"
              onClick={handleAddChargePoint}
              disabled={!newChargePointIdentity}
            >
              Add ChargePoint
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
