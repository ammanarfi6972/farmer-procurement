# Project Context

## SIH problem

**Problem ID:** SIH26032  
**Problem title:** Farmer Procurement System  
**Organization:** Ministry of Consumer Affairs, Food & Public Distribution  
**Department:** Department of Consumer Affairs (DoCA)  
**Category:** Software

The team-provided official SIH screenshot shows the theme as **Smart Automation** and describes the core problem as:

> Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status.

The same screenshot gives the expected solution as a platform that:

- enables farmer registration and slot booking;
- provides real-time queue management;
- sends SMS/app notifications;
- tracks procurement and payment status;
- reduces congestion and waiting time at procurement centres.

### Important verification note

An external SIH 2026 problem-statement mirror currently presents conflicting theme metadata for SIH26032. The project's **official screenshot supplied by the team is the authoritative source for the team's selected problem metadata**. Do not overwrite the project theme based on third-party mirrors without team approval.

## Product thesis

The system creates a digital coordination layer between:

- farmers;
- procurement centres;
- centre staff;
- centre managers;
- district administrators;
- super administrators.

The main value loop is:

`Register → Verify → Find Centre → Book Slot → Receive Token → Check In → Track Queue → Procurement → Bill → Payment Status`

## What success means

A successful prototype should make the following visible:

1. a farmer can understand where and when to go;
2. the farmer can see queue position and estimated wait;
3. staff can process farmers in a controlled queue;
4. managers can monitor centre capacity and throughput;
5. administrators can see cross-centre performance;
6. procurement and payment status is transparent;
7. the same platform is configurable across states and commodities.

## Explicit non-goals for SIH prototype

- no real Aadhaar/eKYC integration;
- no real government procurement API dependency;
- no real bank/payment gateway dependency for farmer payments;
- no hardware integration;
- no AI/ML model;
- no fabricated government datasets;
- no hard-coded MSP values presented as official current prices;
- no claim that the prototype replaces an existing government portal.

## Real-world framing

The system should be presented as a coordination and visibility solution that can integrate with official procurement workflows, rather than as a replacement for every government procurement system.

Third-party research indicates that government procurement platforms already support parts of registration and scheduling. The differentiator for this project is the integrated real-time queue, dynamic ETA, operational visibility, and configurable multi-role workflow.
