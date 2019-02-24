import {Component, OnInit} from '@angular/core';
import { LocationTrackerService } from '../../services/locationTracker/location-tracker.service';


import * as L from 'leaflet';

@Component({
    selector: 'app-map',
    templateUrl: 'map.page.html',
    styleUrls: ['map.page.scss']
})
export class MapPage implements OnInit {

    map: any;

    constructor(public locationService: LocationTrackerService) {

        this.locationService.positionChange.subscribe((value) => {
            if (this.map) {
                console.log('RICALCOLO');
                this.relocateMap(this.map);
            }
        });
    }

    ngOnInit() {
        this.loadmap();
    }

    public relocateMap (map: any) {
        map.locate({
            setView: true,
            whatch: true,
            timeout: 10000,
            minZoom: 7,
            enableHighAccuracy: true,
            maxZoom: 18
        }).on('locationfound', (e) => {
            this.invalidateMap(map);
            map.setZoom(16);
            console.log('LOCATION FOUNDDDDD');
            const markerGroup = L.featureGroup();
            const marker: any = L.marker([e.latitude, e.longitude]).on('click', () => {
                alert('Marker clicked');
            });
            markerGroup.addLayer(marker);
            map.addLayer(markerGroup);
        }).on('locationerror', (err) => {
            alert(err.message);
        });
    }

    private invalidateMap(map: any) {
        setTimeout(() => {
            map.invalidateSize();
        }, 1000);
    }

    private loadmap() {
        this.map = L.map('map', {
            center: [-6.177635, 106.826439],
            zoom: 7,
            minZoom: 7,
            maxZoom: 18,
            attributionControl: true,
            zoomControl: true
            // zoomAnimation: false,
            // fadeAnimation: false,
            // markerZoomAnimation: false,
            // renderer: L.canvas()
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

        this.relocateMap(this.map);
    }

}
