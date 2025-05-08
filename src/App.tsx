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
  const [selectedChargePoint, setSelectedChargePoint] = useState<any>(null);
  const [editedOrganizationName, setEditedOrganizationName] = useState("");
  const [editedOrganizationLegalEntity, setEditedOrganizationLegalEntity] = useState("");
  const [editedChargePointIdentity, setEditedChargePointIdentity] = useState("");
  const [editedChargePointOrgId, setEditedChargePointOrgId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingChargePoint, setIsEditingChargePoint] = useState(false); 

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

      setIsEditing(false);
      setIsEditingChargePoint(false);
      setSelectedOrganization(null);
      setChargePoints([]);

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
    setIsEditing(false);
    setIsEditingChargePoint(false);
    setSelectedOrganization(null); 

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

  const handleDeleteOrganization = async (orgId: string) => {
    try {
      await axios.delete(`${API_BASE}/organizations/${orgId}`);
      setOrganizations(organizations.filter((org) => org.id !== orgId));
      if (selectedOrganization?.id === orgId) {
        setSelectedOrganization(null);
        setChargePoints([]);
      }
    } catch (error) {
      console.error("Error deleting organization", error);
    }
  };

  const handleDeleteChargePoint = async (cpId: string) => {
    try {
      await axios.delete(`${API_BASE}/chargepoints/${cpId}`);
      setChargePoints(chargePoints.filter((cp) => cp.id !== cpId));
    } catch (error) {
      console.error("Error deleting charge point", error);
    }
  };

  const handleEditOrganization = (org: any) => {
    setIsEditingChargePoint(false);
    setIsEditing(true);

    setEditedOrganizationName(org.name);
    setEditedOrganizationLegalEntity(org.legalEntity);
    setSelectedOrganization(org);
  };

  const handleSaveEditedOrganization = async () => {
    if (!editedOrganizationName) return;

    try {
      const response = await axios.put(`${API_BASE}/organizations/${selectedOrganization.id}`, {
        name: editedOrganizationName,
        legalEntity: editedOrganizationLegalEntity,
      });

      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === selectedOrganization.id
            ? { ...org, name: response.data.data.name, legalEntity: response.data.data.legalEntity }
            : org
        )
      );
      setSelectedOrganization(response.data.data);
      setEditedOrganizationName("");
      setEditedOrganizationLegalEntity("");
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing organization", error);
    }
  };

  const handleEditChargePoint = (cp: any) => {
    setIsEditing(false);
    setIsEditingChargePoint(true);

    setEditedChargePointIdentity(cp.identity);
    setEditedChargePointOrgId(cp.organizationId);
    setSelectedChargePoint(cp);
  };

  const handleSaveEditedChargePoint = async () => {
    if (!editedChargePointIdentity) return;

    try {
      const response = await axios.put(`${API_BASE}/chargepoints/${selectedChargePoint.id}`, {
        identity: editedChargePointIdentity,
        organizationId: editedChargePointOrgId,
      });

      setChargePoints((prev) =>
        prev.map((cp) =>
          cp.id === selectedChargePoint.id
            ? { ...cp, identity: response.data.identity, organizationId: response.data.organizationId }
            : cp
        )
      );
      setSelectedChargePoint(response.data.data);
      setEditedChargePointIdentity("");
      setEditedChargePointOrgId("");
      setIsEditingChargePoint(false);
    } catch (error) {
      console.error("Error editing charge point", error);
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
                  <button
                    className="btn btn-warning btn-sm ms-2"
                    onClick={() => handleEditOrganization(org)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => handleDeleteOrganization(org.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {selectedOrganization && !isEditingChargePoint && !isEditing && (
        <div className="card p-4 mt-4">
          <h2 className="h4">
            ChargePoints for {selectedOrganization.name}
          </h2>
          <ul className="list-group mb-4">
            {chargePoints.map((cp: any) => (
              <li key={cp.id} className="list-group-item">
                {cp.identity}{" "}
                <button
                  className="btn btn-warning btn-sm ms-2"
                  onClick={() => handleEditChargePoint(cp)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDeleteChargePoint(cp.id)}
                >
                  Delete
                </button>
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

      {isEditing && selectedOrganization && (
        <div className="card p-4 mt-4">
          <h2 className="h4">Edit Organization</h2>
          <input
            className="form-control mt-2"
            type="text"
            value={editedOrganizationName}
            onChange={(e) => setEditedOrganizationName(e.target.value)}
            placeholder="Edit Organization Name"
          />
          <input
            className="form-control mt-2"
            type="text"
            value={editedOrganizationLegalEntity}
            onChange={(e) => setEditedOrganizationLegalEntity(e.target.value)}
            placeholder="Edit Legal Entity"
          />
          <button
            className="btn btn-primary mt-3"
            onClick={handleSaveEditedOrganization}
            disabled={!editedOrganizationName}
          >
            Save Changes
          </button>
        </div>
      )}

      {isEditingChargePoint && selectedChargePoint && (
        <div className="card p-4 mt-4">
          <h2 className="h4">Edit ChargePoint</h2>
          <input
            className="form-control mt-2"
            type="text"
            value={editedChargePointIdentity}
            onChange={(e) => setEditedChargePointIdentity(e.target.value)}
            placeholder="Edit ChargePoint Identity"
          />
          <button
            className="btn btn-primary mt-3"
            onClick={handleSaveEditedChargePoint}
            disabled={!editedChargePointIdentity}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
