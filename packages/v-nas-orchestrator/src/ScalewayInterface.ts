export interface Instance {
    id: string;
    name: string;
    arch: string;
    commercial_type: string;
    boot_type: string;
    organization: string;
    project: string;
    hostname: string;
    image: Image;
    volumes: Record<string, Volume>;
    tags: string[];
    state: string;
    protected: boolean;
    state_detail: string;
    public_ip:{
        address: string | null;
        dynamic: boolean;
    };
    public_ips: string[];
    mac_address: string;
    routed_ip_enabled: boolean;
    ipv6: string | null;
    extra_networks: any[];
    dynamic_ip_required: boolean;
    enable_ipv6: boolean;
    private_ip: string | null;
    creation_date: string;
    modification_date: string;
    bootscript: string | null;
    security_group: SecurityGroup;
    location: string | null;
    maintenances: any[];
    allowed_actions: string[];
    placement_group: string | null;
    private_nics: any[];
    zone: string;
}

interface Image {
    id: string;
    name: string;
    organization: string;
    project: string;
    root_volume: RootVolume;
    extra_volumes: Record<string, any>;
    public: boolean;
    arch: string;
    creation_date: string;
    modification_date: string;
    default_bootscript: string | null;
    from_server: string;
    state: string;
    tags: string[];
    zone: string;
}

interface RootVolume {
    id: string;
    name: string;
    volume_type: string;
    size: number;
}

interface Volume {
    boot: boolean;
    id: string;
    name: string;
    volume_type: string;
    export_uri: string | null;
    organization: string;
    project: string;
    server: Record<string, any>;
    size: number;
    state: string;
    creation_date: string;
    modification_date: string;
    tags: string[];
    zone: string;
}

interface SecurityGroup {
    id: string;
    name: string;
}

interface Task {
    id: string;
    description: string;
    status: string;
    href_from: string;
    href_result: string;
    started_at: string;
    terminated_at: string | null;
    progress: number;
    zone: string;
}

interface FlexibleIP {
    id: string;
    address: string | null;
    prefix: string;
    reverse: string | null;
    server: {
        id: string;
        name: string;
    };
    organization: string;
    project: string;
    zone: string;
    type: string;
    state: string;
    tags: string[];
    ipam_id: string;
}
