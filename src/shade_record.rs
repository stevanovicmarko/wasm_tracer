use cgmath::{Point3, Vector3};

use crate::materials::Material;

#[derive(Clone)]
pub struct ShadeRecord {
    pub normal: Vector3<f32>,
    pub local_hit_point: Point3<f32>,
    pub material: Material,
    pub intersect_parameter: f32,
}
