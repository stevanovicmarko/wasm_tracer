extern crate cascade;
extern crate cgmath;

use cgmath::prelude::*;
use cgmath::{vec3, Point3};
use std::{f32, u16, usize};

use super::random;
use Camera;
use Material;
use Sphere;
use World;

pub fn get_predefined_scene(canvas_width: u16, canvas_height: u16) -> (Camera, World) {
    let world = cascade! {
        World::new();
        ..add_object(Box::new(Sphere::new(
        Point3::new(0.0, -1000.5, -1.0),
        1000.0,
        Material::Lambertian {
            r: 0.2,
            g: 0.8,
            b: 0.3,
        },
        )));
        ..add_object(Box::new(Sphere::new(
        Point3::new(0.0, 0.1, -1.0),
        0.6,
        Material::Lambertian {
            r: 0.99,
            g: 0.1,
            b: 0.01,
        },
    )));
    ..add_object(Box::new(Sphere::new(
        Point3::new(1.1, 0.0, -1.0),
        0.5,
        Material::Dielectric{refractive_index: 1.7}
    )));
    ..add_object(Box::new(Sphere::new(
        Point3::new(-0.95, 0.5, -1.0),
        0.45,
        Material::Metallic {
            r: 0.8,
            g: 0.8,
            b: 0.8,
        },
    )));
    ..add_object(Box::new(Sphere::new(
        Point3::new(-1.2, -0.2, -1.0),
        0.3,
        Material::Lambertian {
            r: 0.9,
            g: 0.9,
            b: 0.2,
        },
    )));
    ..add_object(Box::new(Sphere::new(
        Point3::new(0.6, -0.2, -0.3),
        0.3,
        Material::Lambertian {
            r: 0.25,
            g: 0.45,
            b: 0.8,
        },
    )));
    ..add_object(Box::new(Sphere::new(
        Point3::new(-0.6, -0.35, -0.5),
        0.15,
        Material::Dielectric{refractive_index: 1.6}
    )));
    };

    let look_from = Point3::new(0.0, 0.9, 5.0);
    let look_at = Point3::new(0.0, 0.0, -1.0);
    let v_up = vec3(0.0, 1.0, 0.0);
    let dist_to_focus = (look_from - look_at).magnitude();
    let aperture = 0.1;

    let camera = Camera::new(
        &look_from,
        &look_at,
        &v_up,
        20.0,
        f32::from(canvas_width) / f32::from(canvas_height),
        aperture,
        dist_to_focus,
    );

    (camera, world)
}

pub fn get_random_scene(
    canvas_width: u16,
    canvas_height: u16,
    _number_of_spheres: usize,
) -> (Camera, World) {
    let (r, g, b) = (random(), random(), random());

    let world = cascade! {
        World::new();
        ..add_object(Box::new(Sphere::new(
        Point3::new(0.0, -1000.5, -1.0),
        1000.0,
        Material::Lambertian {
            r: 0.2,
            g: 0.8,
            b: 0.3,
        },
        )));
        ..add_object(Box::new(Sphere::new(
        Point3::new(-0.7, -0.1, -0.4),
        0.4,
        Material::Metallic {
            r,
            g,
            b,
        },
    )));
        ..add_object(Box::new(Sphere::new(
        Point3::new(0.0, 0.1, -1.5),
        0.6,
        Material::Dielectric { refractive_index: 1.5 + (0.5 * random()) },
    )));
            ..add_object(Box::new(Sphere::new(
        Point3::new(0.9, 0.3, -3.5),
        0.8,
        Material::Lambertian {
            r: 1.0 - r,
            g: 1.0 - g,
            b: 1.0 - b,
        },
    )));
    };

    //    (0..number_of_spheres).for_each( |_item| {
    //        let radius = random() * 0.2;
    //        world.add_object(Box::new(Sphere::new(
    //            Point3::new(1.0 - (2.0*random()), radius, 10.0 * (1.0 - (2.0*random()))),
    //            radius,
    //            Material::Lambertian {
    //                r: random(),
    //                g: random(),
    //                b: random(),
    //            },
    //        )));
    //    });

    let look_from = Point3::new(0.0, 0.8, 5.0);
    let look_at = Point3::new(0.0, 0.0, -1.0);
    let v_up = vec3(0.0, 1.0, 0.0);
    let dist_to_focus = (look_from - look_at).magnitude();
    let aperture = 0.15;

    let camera = Camera::new(
        &look_from,
        &look_at,
        &v_up,
        20.0,
        f32::from(canvas_width) / f32::from(canvas_height),
        aperture,
        dist_to_focus,
    );

    (camera, world)
}
