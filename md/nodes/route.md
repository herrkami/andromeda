# Routing
**Summary from Wikipedia**: 
In electronic design, wire routing, commonly called simply routing, is a step in the design of printed circuit boards (PCBs) and integrated circuits (ICs). It builds on a preceding step, called placement, which determines the location of each active element of an IC or component on a PCB.  After placement, the routing step adds wires needed to properly connect the placed components while obeying all design rules for the IC. Together, the placement and routing steps of IC design are known as place and route.
The task of all routers is the same. They are given some pre-existing polygons consisting of pins (also called terminals) on cells, and optionally some pre-existing wiring called preroutes. Each of these polygons are associated with a net, usually by name or number. The primary task of the router is to create geometries such that all terminals assigned to the same net are connected, no terminals assigned to different nets are connected, and all design rules are obeyed. A router can fail by not connecting terminals that should be connected (an open), by mistakenly connecting two terminals that should not be connected (a short), or by creating a design rule violation. In addition, to correctly connect the nets, routers may also be expected to make sure the design meets timing, has no crosstalk problems, meets any metal density requirements, does not suffer from antenna effects, and so on. This long list of often conflicting objectives is what makes routing extremely difficult.
Almost every problem associated with routing is known to be intractable. The simplest routing problem, called the Steiner tree problem, of finding the shortest route for one net in one layer with no obstacles and no design rules is NP-hard if all angles are allowed and NP-complete if only horizontal and vertical wires are allowed. Variants of channel routing have also been shown to be NP-complete, as well as routing which reduces crosstalk, number of vias, and so on.
Routers therefore seldom attempt to find an optimum result. Instead, almost all routing is based on heuristics which try to find a solution that is good enough.
Design rules sometimes vary considerably from layer to layer. For example, the allowed width and spacing on the lower layers may be four or more times smaller than the allowed widths and spacings on the upper layers. This introduces many additional complications not faced by routers for other applications such as printed circuit board or multi-chip module design. Particular difficulties ensue if the rules are not simple multiples of each other, and when vias must traverse between layers with different rules.

## Links
- Wikipedia: https://en.wikipedia.org/wiki/Routing_(electronic_design_automation)

## Tools

### Proprietary
- List of proprietary tools

### Open Source
- List of open source tools

## Research projects
- List of research projects
