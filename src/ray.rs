use cgmath::{Point3, Vector3};
use std::f32;

#[derive(Clone, Copy)]
pub struct Ray {
    pub origin: Point3<f32>,
    pub direction: Vector3<f32>,
}

impl Ray {
    pub fn new(origin: Point3<f32>, direction: Vector3<f32>) -> Self {
        Ray { origin, direction }
    }

    // pub fn origin(&mut self, origin: Point3<f32>) {
    //     self.origin = origin;
    // }
    // pub fn direction(&mut self, direction: Vector3<f32>) {
    //     self.direction = direction;
    // }

    pub fn point_at_parameter(&self, t: f32) -> Point3<f32> {
        self.origin + (self.direction * t)
    }
}
