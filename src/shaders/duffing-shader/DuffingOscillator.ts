export class DuffingOscillator {
  private x: number = 0;
  private y: number = 0;
  private dx: number = 0;
  private dy: number = 0;
  private delta: number; // damping coefficient (δ)
  private alpha: number; // linear stiffness (α)
  private beta: number; // cubic stiffness (β)
  private gamma: number; // forcing amplitude (γ)
  private omega: number; // forcing frequency (ω)
  private time: number = 0;
  private phaseOffset: number;
  private baseX: number;
  private baseY: number;
  private index: number;
  private totalOscillators: number;
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

  private toNDC(x: number, y: number): [number, number] {
    // Convert from our simulation space to NDC space
    return [x * 2.0, y * 2.0];
  }

  private fromNDC(x: number, y: number): [number, number] {
    // Convert from NDC space back to simulation space
    return [x / 2.0, y / 2.0];
  }

  public update(dt: number): { x: number; y: number; dx: number; dy: number } {
    // Classical Duffing equation implementation
    // ẍ + δẋ + αx + βx³ = γcos(ωt)
    const forcing =
      this.gamma * Math.cos(this.omega * this.time + this.phaseOffset);

    // X component
    const ddx =
      -this.delta * this.dx -
      this.alpha * this.x -
      this.beta * Math.pow(this.x, 3) +
      forcing;
    this.dx += ddx * dt;

    // Y component (similar to X but with sin for phase difference)
    const ddy =
      -this.delta * this.dy -
      this.alpha * this.y -
      this.beta * Math.pow(this.y, 3) +
      this.gamma * Math.sin(this.omega * this.time + this.phaseOffset);
    this.dy += ddy * dt;

    // Add progressive containment force
    const maxDist = 0.4;
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

    // Convert to NDC space for boundary checking
    const currentPos = this.toNDC(this.x + this.baseX, this.y + this.baseY);
    const nextPos = this.toNDC(nextX + this.baseX, nextY + this.baseY);

    // Boundary checking and reflection (keeping existing implementation)
    if (!this.isInBoundaries(nextPos)) {
      const lines = [
        [this.boundaries.botLeft, this.boundaries.botRight],
        [this.boundaries.botRight, this.boundaries.topRight],
        [this.boundaries.topRight, this.boundaries.topLeft],
        [this.boundaries.topLeft, this.boundaries.botLeft],
      ];

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
}
