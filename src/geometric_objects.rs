extern crate cgmath;

use cgmath::prelude::*;
use cgmath::{Point3, Vector3};
use std::f32;

use materials::Material;
use ray::Ray;
use shade_record::ShadeRecord;

pub trait GeometricObject {
    fn hit(&self, ray: &Ray, t_min: f32, t_max: f32) -> Option<ShadeRecord>;
}

pub struct Sphere {
    center: Point3<f32>,
    radius: f32,
    material: Material,
}

impl Sphere {
    pub fn new(center: Point3<f32>, radius: f32, material: Material) -> Self {
        Sphere {
            center,
            radius,
            material,
        }
    }
}

impl GeometricObject for Sphere {
    fn hit(&self, ray: &Ray, t_min: f32, t_max: f32) -> Option<ShadeRecord> {
        let oc: Vector3<f32> = ray.origin - self.center;
        let a = ray.direction.magnitude2();
        let b = oc.dot(ray.direction);
        let c = oc.magnitude2() - self.radius * self.radius;
        let discriminant = b * b - a * c;

        let (near, far) = (
            (-b - discriminant.sqrt()) / a,
            (-b + discriminant.sqrt()) / a,
        );

        if discriminant > 0.0 {
            let option_t: Option<f32> = if near > t_min && near < t_max {
                Some(near)
            } else if far > t_min && far < t_max {
                Some(far)
            } else {
                None
            };

            if let Some(intersect_parameter) = option_t {
                let local_hit_point = ray.point_at_parameter(intersect_parameter);
                let normal = (local_hit_point - self.center) / self.radius;

                return Some(ShadeRecord {
                    intersect_parameter,
                    local_hit_point,
                    normal,
                    material: self.material,
                });
            }
        }
        None
    }
}
