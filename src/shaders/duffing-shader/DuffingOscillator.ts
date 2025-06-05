export class DuffingOscillator {
  // Position and velocity in local oscillator space
  private x: number = 0; // Displacement from base position (X)
  private y: number = 0; // Displacement from base position (Y)
  private dx: number = 0; // Velocity X component
  private dy: number = 0; // Velocity Y component

  // Classical Duffing equation parameters
  // ẍ + δẋ + αx + βx³ = γcos(ωt)
  private delta: number; // Damping coefficient (δ) - energy loss
  private alpha: number; // Linear stiffness (α) - restoring force
  private beta: number; // Cubic stiffness (β) - non-linear term
  private gamma: number; // Forcing amplitude (γ) - external drive
  private omega: number; // Forcing frequency (ω) - oscillation rate

  // Simulation state
  private time: number = 0; // Current simulation time
  private phaseOffset: number; // Unique phase for this oscillator

  // Multi-oscillator system
  private baseX: number; // Fixed position in circle formation
  private baseY: number; // Fixed position in circle formation
  private index: number; // Oscillator index (0, 1, 2, ...)
  private totalOscillators: number; // Total count for phase calculation

  // Spatial constraints Geometric boundary definition
  private boundaries: {
    botLeft: [number, number];
    botRight: [number, number];
    topLeft: [number, number];
    topRight: [number, number];
  };

  constructor(
    params: {
      delta?: number;
      alpha?: number;
      beta?: number;
      gamma?: number;
      omega?: number;
      phaseOffset?: number;
      index?: number;
      total?: number;
      boundaries?: {
        botLeft: [number, number];
        botRight: [number, number];
        topLeft: [number, number];
        topRight: [number, number];
      };
    } = {}
  ) {
    // Classical Duffing parameters tuned for chaos
    this.delta = params.delta ?? 0.05;
    this.alpha = params.alpha ?? 1.2;
    this.beta = params.beta ?? 0.1;
    this.gamma = params.gamma ?? 1.0;
    this.omega = params.omega ?? 0.6;

    this.index = params.index ?? 0;
    this.totalOscillators = params.total ?? 1;
    this.boundaries = params.boundaries ?? {
      botLeft: [-1, -1],
      botRight: [1, -1],
      topLeft: [-1, 1],
      topRight: [1, 1],
    };

    // Calculate phase offset based on position in the circle
    this.phaseOffset = (2 * Math.PI * this.index) / this.totalOscillators;

    // Position oscillators in a symmetric circle
    const angle = this.phaseOffset;
    const radius = 0.3;
    this.baseX = Math.cos(angle) * radius;
    this.baseY = Math.sin(angle) * radius;

    // Initialize with small random velocities for more chaotic initial conditions
    const randSpeed = 0.02;
    this.dx = (Math.random() - 0.5) * randSpeed;
    this.dy = (Math.random() - 0.5) * randSpeed;
  }

  // Returns positive if point p is on the left side of the line from a to b
  private sideOfLine(
    p: [number, number],
    a: [number, number],
    b: [number, number]
  ): number {
    return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
  }

  // Check if a point is inside the boundaries
  private isInBoundaries(p: [number, number]): boolean {
    const s1 = this.sideOfLine(
      p,
      this.boundaries.botLeft,
      this.boundaries.botRight
    );
    const s2 = this.sideOfLine(
      p,
      this.boundaries.botRight,
      this.boundaries.topRight
    );
    const s3 = this.sideOfLine(
      p,
      this.boundaries.topRight,
      this.boundaries.topLeft
    );
    const s4 = this.sideOfLine(
      p,
      this.boundaries.topLeft,
      this.boundaries.botLeft
    );
    return s1 >= 0 && s2 >= 0 && s3 <= 0 && s4 <= 0;
  }

  // Reflect velocity off a boundary line
  private reflectVelocity(
    p: [number, number],
    v: [number, number],
    a: [number, number],
    b: [number, number]
  ): [number, number] {
    // Calculate normal vector to the line
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.sqrt(dx * dx + dy * dy);
    const normal: [number, number] = [-dy / len, dx / len];

    // Calculate dot product
    const dot = v[0] * normal[0] + v[1] * normal[1];

    // Reflect velocity
    return [v[0] - 2 * dot * normal[0], v[1] - 2 * dot * normal[1]];
  }

  // Convert from our simulation space to NDC space
  private toNDC(x: number, y: number): [number, number] {
    return [x * 2.0, y * 2.0];
  }

  // Convert from NDC space back to simulation space
  private fromNDC(x: number, y: number): [number, number] {
    return [x / 2.0, y / 2.0];
  }

  public update(dt: number): { x: number; y: number; dx: number; dy: number } {
    // modified Duffing equation

    // X component
    // ẍ + δẋ + αx + βx³ = γcos(ωt)
    const ddx =
      -this.delta * this.dx -
      this.alpha * this.x -
      this.beta * Math.pow(this.x, 3) +
      this.gamma * Math.cos(this.omega * this.time + this.phaseOffset);
    this.dx += ddx * dt;

    // Y component
    // ẍ + δẋ + αx + βx³ = γsin(ωt)
    const ddy =
      -this.delta * this.dy -
      this.alpha * this.y -
      this.beta * Math.pow(this.y, 3) +
      this.gamma * Math.sin(this.omega * this.time + this.phaseOffset);
    this.dy += ddy * dt;

    // Add progressive containment force
    const maxDist = 0.4; // max dist from base position
    const dist = Math.sqrt(this.x * this.x + this.y * this.y); // Distance from base position

    if (dist > maxDist) {
      const containmentForce = (0.05 * (dist - maxDist)) / maxDist;
      const dirX = -this.x / dist; // Direction relative to base position
      const dirY = -this.y / dist; // Direction relative to base position
      this.dx += dirX * containmentForce;
      this.dy += dirY * containmentForce;
    }

    // Update positions
    let nextX = this.x + this.dx * dt;
    let nextY = this.y + this.dy * dt;

    // Boundary checking and reflection (keeping existing implementation)
    // Convert to NDC space for boundary checking
    const nextPos = this.toNDC(nextX + this.baseX, nextY + this.baseY);

    if (!this.isInBoundaries(nextPos)) {
      const lines = [
        [this.boundaries.botLeft, this.boundaries.botRight],
        [this.boundaries.botRight, this.boundaries.topRight],
        [this.boundaries.topRight, this.boundaries.topLeft],
        [this.boundaries.topLeft, this.boundaries.botLeft],
      ];

      const currentPos = this.toNDC(this.x + this.baseX, this.y + this.baseY);
      for (const [a, b] of lines) {
        if (this.sideOfLine(nextPos, a, b) < 0) {
          const ndcVel = this.toNDC(this.dx, this.dy);
          const [reflectedDx, reflectedDy] = this.reflectVelocity(
            currentPos,
            ndcVel,
            a,
            b
          );
          [this.dx, this.dy] = this.fromNDC(reflectedDx, reflectedDy);

          nextX = this.x + this.dx * dt;
          nextY = this.y + this.dy * dt;
          break;
        }
      }
    }

    // Update positions
    this.x = nextX;
    this.y = nextY;
    this.time += dt;

    return {
      x: this.x + this.baseX,
      y: this.y + this.baseY,
      dx: this.dx,
      dy: this.dy,
    };
  }

  public reset(): void {
    const angle = (2 * Math.PI * this.index) / this.totalOscillators;
    const radius = 0.4;
    this.baseX = Math.cos(angle) * radius;
    this.baseY = Math.sin(angle) * radius;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.time = 0;
  }

  public setBoundaries(boundaries: {
    botLeft: [number, number];
    botRight: [number, number];
    topLeft: [number, number];
    topRight: [number, number];
  }): void {
    this.boundaries = boundaries;
  }

  /**
   * Combined update and splat data generation method
   */
  public updateAndGetSplat(
    dt: number,
    canvas: HTMLCanvasElement,
    color: { r: number; g: number; b: number },
    prevTexcoord: { x: number; y: number }
  ): {
    splatData: {
      texcoordX: number;
      texcoordY: number;
      prevTexcoordX: number;
      prevTexcoordY: number;
      deltaX: number;
      deltaY: number;
      color: { r: number; g: number; b: number };
    };
    newTexcoord: { x: number; y: number };
  } {
    // Update physics using existing method
    const { x, y, dx, dy } = this.update(dt);

    // Convert oscillator space [-0.5, 0.5] to texture space [0, 1]
    const texcoordX = Math.min(Math.max(x + 0.5, 0), 1);
    const texcoordY = Math.min(Math.max(y + 0.5, 0), 1);

    // Apply aspect ratio correction to velocities
    const aspectRatio = canvas.width / canvas.height;
    let correctedDx = dx * 0.5; // Scale down velocity
    let correctedDy = dy * 0.5;

    // Correct for aspect ratio
    if (aspectRatio < 1) {
      correctedDx *= aspectRatio; // Portrait: compress X movement
    } else if (aspectRatio > 1) {
      correctedDy /= aspectRatio; // Landscape: compress Y movement
    }

    return {
      splatData: {
        texcoordX,
        texcoordY,
        prevTexcoordX: prevTexcoord.x,
        prevTexcoordY: prevTexcoord.y,
        deltaX: correctedDx,
        deltaY: correctedDy,
        color,
      },
      newTexcoord: { x: texcoordX, y: texcoordY },
    };
  }
}
