# Technical Specification: Autonomous Dispatch and Logic Engine

## 1. Logic Engine (Satori AI Framework)
The Satori Engine is a deterministic logic layer that processes campus-wide telemetry to execute load-management decisions. It operates on a 1-minute polling interval to ensure high-responsiveness to environmental shifts.

### 1.1 Occupancy-Based Modulation
The system cross-references the Central Timetable Database with real-time PIR (Passive Infrared) sensor data. 
- **Scenario: Room Booked + Occupancy Detected**: HVAC and Lighting systems operate at peak efficiency set-points.
- **Scenario: Room Booked + No Occupancy**: After a 10-minute grace period, the system enters 'Standby Mode' (Lights off, HVAC set-point increased by 2.5°C).
- **Scenario: No Booking + Occupancy Detected**: System triggers an anomaly alert to the Facility Manager while maintaining basic lighting for safety.

### 1.2 Solar-Priority Dispatch Hierarchy
The Arasaka Energy OS utilizes a tiered dispatch model to minimize grid imports during peak solar windows.
1. **Tier 1: Academic Load (Critical)**: Lecture halls, laboratories, and server rooms. These loads receive the first 100% of available on-site generation.
2. **Tier 2: Utility Support (Infrastructure)**: Reverse Vending Machines (RVMs) and campus water filtration systems.
3. **Tier 3: Flexible Demand (Buffer)**: Electric Vehicle (EV) charging stations and utility-scale battery storage. These loads are modulated (throttled or expanded) based on the instantaneous solar surplus.

## 2. Data Flow and API Integration
### 2.1 Backend Architecture
The system utilizes a serverless architecture optimized for high-concurrency telemetry ingestion. 
- **Ingestion**: API routes (Next.js) handle incoming sensor data via authenticated POST requests.
- **Processing**: Server-side functions calculate the 'Campus Energy State' and write outcomes to the Firestore database.
- **Frontend Sync**: Clients utilize Firestore real-time listeners to update the Dashboard UI without page refreshes.

### 2.2 Integration Protocols
Hardware assets must support the following protocols for native OS integration:
- **HVAC/BMS**: BACnet/IP or Modbus TCP.
- **Electrical Meters**: MQTT over SSL.
- **RVMs/EV Chargers**: RESTful API endpoints for status polling and command execution.

## 3. Security and Resilience
- **Identity Management**: Implementation of custom Firebase Claims to enforce strict Role-Based Access Control (RBAC).
- **Fail-Safe Mechanism**: In the event of a network failure or OS timeout, all hardware relays default to 'Bypass Mode,' reverting control to the local manual switches to ensure campus safety.
